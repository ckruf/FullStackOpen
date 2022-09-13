const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const user = require("../models/user");

// !!! Remember to start your docker MongoDB for testing first !!!

// wraps app in supertest function, to create a so called superagent object,
// which "provides a high level abstraction for testing HTTP.
// allows us to send requests to the app without explicitly starting it, setting up ports etc.
const api = supertest(app);


// setup function to run before each test to delete all existing blogs from database
// and add test data
beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    // map array of blog javascript objects to array of Blog mongoose objects
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    // create array of promises representing results of mongoose save() operation
    const promiseArray = blogObjects.map(blog => blog.save());
    // await until all of the promises are resolved (in parallel)
    await Promise.all(promiseArray);
})

// teardown function to run after all tests are finished, to close connection to db
afterAll(() => {
    mongoose.connection.close();
})

describe("GET /api/blogs", () => {
    test("sends JSON response with status code 200", async () => {
        // second argument of second 'expect' is regex
        await api.get("/api/blogs").expect(200).expect("Content-Type", /application\/json/);
    });

    test("returns the correct number of objects", async () => {
        const blogCountInDb = await helper.blogCountInDb();
        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(blogCountInDb);
    });

    test("returns blog objects whose identifier is id, rather than mongo default _id", async () => {
        const response = await api.get("/api/blogs");
        const returnedBlogs = response.body;
        returnedBlogs.forEach(blog => {
            expect(blog.id).toBeDefined();
        });
    });

    test("returns blog object with correct joined info about user ('populate' in Mongoose)", async () => {
        const userCompliant = new User(tester.userCompliant);
        const savedUser = await userCompliant.save();
        const id = savedUser._id.toString();
        tester.singleBlogComplete.user = id;
        const singleBlogComplete = new Blog(tester.singleBlogComplete);
        await singleBlogComplete.save();
        const response = await api.get("/api/blogs").expect(200);
        const blogResponse = response.body[0];
        expect(blogResponse.user.username).toEqual(tester.userCompliant.username);
        expect(blogResponse.user.name).toEqual(tester.userCompliant.name);
    });
});

describe("POST /api/blogs", () => {
    test("document count in DB increases by 1 when complete JSON is sent by authorized user", async () => {
        const blogCountInDbBefore = await helper.blogCountInDb();
        await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogComplete);
        const blogCountInDbAfter = await helper.blogCountInDb();
        const addedBlogs = blogCountInDbAfter - blogCountInDbBefore;
        expect(addedBlogs).toEqual(1);
    });

    test("saves blog to DB with correct content (checked in DB, not response) for authorized user", async () => {
        const userId = await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogComplete);
        const blogsInDb = await helper.blogsInDb();
        const blogsInDbNoId = blogsInDb.map(blog => delete blog.id);
        helper.singleBlogComplete.user = userId;
        expect(blogsInDb).toContainEqual(helper.singleBlogComplete);
    });

    test("sends correct data in response (including user id) for authorized user", async () => {
        const userId = await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        const response = await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogComplete).expect(200);
        const blogResponse = response.body;
        expect(blogResponse.title).toEqual(helper.singleBlogComplete.title);
        expect(blogResponse.author).toEqual(helper.singleBlogComplete.author);
        expect(blogResponse.url).toEqual(helper.singleBlogComplete.url);
        expect(blogResponse.likes).toEqual(helpoer.singleBlogComplete.likes);
        expect(blogResponse.user).toEqual(userId); 
    });

    test("default 'likes' to 0 if missing from sent JSON (checked in DB, not response) for authorized user", async () => {
        await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant); 
        await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogMissingLikes);
        const blogsInDb = await helper.blogsInDb();
        const addedBlog = blogsInDb.find(blog => {
            return (blog.title = helper.singleBlogMissingLikes.title
                && blog.author === helper.singleBlogMissingLikes.author
                && blog.url === helper.singleBlogMissingLikes.url)
        });
        expect(addedBlog.likes).toEqual(0);
    });

    test("responds with status code 400 when title is missing from request data for authorized user", async () => {
        await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogMissingTitle).expect(400);
    });

    test("responds with status code 400 when url is missing from request data for authorized user", async () => {
        await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        await api.set("Authorization", `bearer ${userToken}`).post("/api/blogs").send(helper.singleBlogMissingUrl).expect(400);
    });

    test("responds with status code 401 when authorization header not included", async () => {
        await api.post("/api/blogs").send(helper.singleBlogComplete).expect(401);
    });

    test("responds with status code 401 when authorization header does not start wtih 'bearer'", async () => {
        await helper.saveUserToDb(helper.userCompliant);
        const userToken = await helper.getUserToken(helper.userCompliant);
        await api.set("Authorization", userToken).post("/api/blogs").send(helper.singleBlogComplete).expect(401);
    });

    test("responds with status code 401 when invalid token is sent in authorization header", async () => {
        const invalidUserToken = helper.getInvalidUserToken();
        await api.set("Authorization", `bearer ${invalidUserToken}`).post("/api/blogs").send(helper.singleBlogComplete).expect(401);
    });

    test("responds with status code 401 when token with wrong secret is sent in authorizaton header", async () => {
        await helper.saveUserToDb(helper.userCompliant);
        const invalidUserToken = await helper.getUserTokenWrongSecret(helper.userCompliant);
        await api.set("Authorization", `bearer ${invalidUserToken}`).post("/api/blogs").send(helper.singleBlogComplete).expect(401);
    });
});

describe("DELETE /api/blogs/:id", () => {
    test("sends response with status code 204 when actual id is used and user is authorized", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const id = savedBlog._id.toString();
        const userToken = helper.getUserToken(testUser)
        await api.set("Authorization", `bearer ${userToken}`).delete(`/api/blogs/${id}`).expect(204);
    });
    test("count of documents in DB decreases by one when actual id is used and user is authorized", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const blogCountInDbBefore = await helper.blogCountInDb();

        const userId = await helper.saveUserToDb(testUser);
        testBlog.user = userId;

        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const id = savedBlog._id.toString();

        const userToken = helper.getUserToken(testUser);

        await api.set("Authorization", `bearer ${userToken}`).delete(`/api/blogs/${id}`);
        const blogCountInDbAfter = await helper.blogCountInDb();
        const removedBlogs = blogCountInDbBefore - blogCountInDbAfter;
        expect(removedBlogs).toEqual(1);
    });
    test("sends response with status code 404 when using non existing legit ObjectId", async () => {
        const id = await helper.nonExistingId();
        await api.delete(`/api/blogs/${id}`).expect(404);
    });
    test("sends response with status code 400 when non legit Objectid is sent", async () => {
        await api.delete("/api/blogs/bullshitID").expect(400);
    });

    test("responds with status code 401 when authorization header not included", async () => {

    });

    test("responds with status code 401 when authorization header does not start wtih 'bearer'", async () => {

    });

    test("responds with status code 401 when invalid token is sent in authorization header", async () => {

    });

    test("responds with status code 403 when user id in token does not match blog's 'user'", async () => {

    });
});

describe("PATCH /api/blogs/:id", () => {
    test("sends response with 404 status code using non-existent legit ObjectId", async () => {
        const id = await helper.nonExistingId();
        await api.patch(`/api/blogs/${id}`).expect(404);
    });

    test("sends response with 400 status code when non legit ObjectId is sent", async () => {
        await api.patch("/api/blogs/bulshitID").expect(400);
    });

    test("count of documents remains unchanged when sending empty body & existing ID", async () => {
        const blogCountInDbBefore = await helper.blogCountInDb();
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog.id;
        await api.patch(`/api/blogs/${id}`);
        const blogCountInDbAfter = await helper.blogCountInDb()
        expect(blogCountInDbBefore).toEqual(blogCountInDbAfter);
    });

    test("likes update correctly when existing ID is sent and status code is 200", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog.id;
        let likesBefore = randomBlog.likes;
        let incrementedLikes = likesBefore + 1;
        await api.patch(`/api/blogs/${id}`).send({likes: incrementedLikes}).expect(200);
        const randomBlogUpdated = await helper.getBlogByIdInDb(id);
        console.log("randomBlogUpdated is");
        console.log(randomBlogUpdated);
        expect(randomBlogUpdated.likes).toEqual(incrementedLikes);
        expect(randomBlogUpdated.likes - randomBlog.likes).toEqual(1);
    });

    test("title, url, author and likes update correctly in db and status code is 200", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog.id;
        await api.patch(`/api/blogs/${id}`).send(helper.singleBlogComplete).expect(200);
        const randomBlogUpdated = await helper.getBlogByIdInDb(id);
        expect(randomBlogUpdated.title).toEqual(helper.singleBlogComplete.title);
        expect(randomBlogUpdated.author).toEqual(helper.singleBlogComplete.author);
        expect(randomBlogUpdated.url).toEqual(helper.singleBlogComplete.url);
        expect(randomBlogUpdated.likes).toEqual(helper.singleBlogComplete.likes);
    });

    test("title, url, author and likes update correctly in response and status code is 200", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog.id;
        const response = await api.patch(`/api/blogs/${id}`).send(helper.singleBlogComplete).expect(200);
        const updatedBlogResponse = response.body;
        expect(updatedBlogResponse.title).toEqual(helper.singleBlogComplete.title);
        expect(updatedBlogResponse.author).toEqual(helper.singleBlogComplete.author);
        expect(updatedBlogResponse.url).toEqual(helper.singleBlogComplete.url);
        expect(updatedBlogResponse.likes).toEqual(helper.singleBlogComplete.likes);
    });

    test("does not add attribute which is not part of model", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog.id;
        await api.patch(`/api/blogs/${id}`).send({dislikes: 1000});
        const updatedBlog = await helper.getBlogByIdInDb(id);
        expect(updatedBlog.dislikes).toBeUndefined();
    });

    test("responds with status code 403 when user id in token does not match blog's 'user'", async () => {

    });
});

describe("POST /api/users", () => {
    test("saves user to db with correct username, name and password hash when reqs fulfilled", async () => {
        await api.post("/api/users").send(helper.userCompliant);
        const userInDb = await User.findOne({username: helper.userCompliant.username});
    });

    test("does not save user to db when username is less than 3 chars and sends 400 status code", async () => {

    });

    test("does not save user to db when password is less than 3 chars and send 400 status code", async () => {

    });

    test("does not save user to db when user with same username exists and sends 400 status code", async () => {

    });

    test("sends correct data and no password in response when reqs fulfilled", async () => {

    });
});

describe("POST /api/login", () => {
    test("responds with correct username, name, valid token and status code 200 when correct creds are given", async () => {

    });

    test("responds with status code 401 when invalid username is given", async () => {

    });

    test("responds with status code 401 when invalid password is given", async () => {

    });
});
