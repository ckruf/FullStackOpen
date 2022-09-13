const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const config = require("../utils/config");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        await blog.save();
        const response = await api.get("/api/blogs").expect(200);
        const testBlogResponse = response.body.find(blog => blog.title === testBlog.title);
        expect(testBlogResponse.user.username).toEqual(testUser.username);
        expect(testBlogResponse.user.name).toEqual(testUser.name);
    });
});

describe("POST /api/blogs", () => {
    test("document count in DB increases by 1 when complete JSON is sent by authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const blogCountInDbBefore = await helper.blogCountInDb();
        await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog);
        const blogCountInDbAfter = await helper.blogCountInDb();
        const addedBlogs = blogCountInDbAfter - blogCountInDbBefore;
        expect(addedBlogs).toEqual(1);
    });

    test("saves blog to DB with correct content (checked in DB, not response) for authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;
        
        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog);
        const blogsInDb = await helper.blogsInDb();
        const blogsInDbNoId = blogsInDb.map(blog => {
            delete blog.id;
            if (blog.user) blog.user = blog.user.toString();
            return blog;
        });
        // add user property to test blog, because POST endpoint adds it based on token
        testBlog.user = userId.toString();
        expect(blogsInDbNoId).toContainEqual(testBlog);
    });

    test("sends correct data in response (including user id) for authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        const response = await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog).expect(201);
        const blogResponse = response.body;
        expect(blogResponse.title).toEqual(testBlog.title);
        expect(blogResponse.author).toEqual(testBlog.author);
        expect(blogResponse.url).toEqual(testBlog.url);
        expect(blogResponse.likes).toEqual(testBlog.likes);
        expect(blogResponse.user).toEqual(userId); 
    });

    test("default 'likes' to 0 if missing from sent JSON (checked in DB, not response) for authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogMissingLikes;
        
        await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser); 
        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog);
        const blogsInDb = await helper.blogsInDb();
        const addedBlog = blogsInDb.find(blog => {
            return (blog.title = testBlog.title
                && blog.author === testBlog.author
                && blog.url === testBlog.url)
        });
        expect(addedBlog.likes).toEqual(0);
    });

    test("updates user in db by adding the newly posted blogs into their 'blogs' array", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);

        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog);
        const testUserInDb = await User.findById(userId);
        const testBlogInDb = await Blog.findOne({title: testBlog.title});
        const testBlogId = testBlogInDb._id.toString();
        const testUsersBlogs = testUserInDb.blogs.map(blog => blog.toString());

        expect(testUsersBlogs).toContain(testBlogId);
    })

    test("responds with status code 400 when title is missing from request data for authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogMissingTitle;
        
        await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog).expect(400);
    });

    test("responds with status code 400 when url is missing from request data for authorized user", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogMissingUrl;

        await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        await api.post("/api/blogs").set("Authorization", `bearer ${userToken}`).send(testBlog).expect(400);
    });

    test("responds with status code 401 when authorization header not included", async () => {
        const testBlog = helper.singleBlogComplete;
        await api.post("/api/blogs").send(testBlog).expect(401);
    });

    test("responds with status code 401 when authorization header does not start wtih 'bearer'", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        await api.post("/api/blogs").set("Authorization", userToken).send(testBlog).expect(401);
    });

    test("responds with status code 401 when invalid token is sent in authorization header", async () => {
        const testBlog = helper.singleBlogComplete;
        const invalidUserToken = helper.getInvalidUserToken();
        await api.post("/api/blogs").set("Authorization", `bearer ${invalidUserToken}`).send(testBlog).expect(401);
    });

    test("responds with status code 401 when token with wrong secret is sent in authorizaton header", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        await helper.saveUserToDb(testUser);
        const invalidUserToken = await helper.getUserTokenWrongSecret(testUser);
        await api.post("/api/blogs").set("Authorization", `bearer ${invalidUserToken}`).send(testBlog).expect(401);
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
        const blogId = savedBlog._id.toString();
        const userToken = await helper.getUserToken(testUser)
        await api.delete(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).expect(204);
    });

    test("count of documents in DB decreases by one when actual id is used and user is authorized", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;


        const userId = await helper.saveUserToDb(testUser);
        testBlog.user = userId;

        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogCountInDbBefore = await helper.blogCountInDb();
        const blogId = savedBlog._id.toString();

        const userToken = await helper.getUserToken(testUser);

        await api.delete(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).expect(204);
        const blogCountInDbAfter = await helper.blogCountInDb();
        const removedBlogs = blogCountInDbBefore - blogCountInDbAfter;
        expect(removedBlogs).toEqual(1);
    });

    test("sends response with status code 404 when using non existing legit ObjectId", async () => {
        const testUser = helper.userCompliant;
        
        await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);

        const nonExistentBlogId = await helper.nonExistingId();
        await api.delete(`/api/blogs/${nonExistentBlogId}`).set("Authorization", `bearer ${userToken}`).expect(404);
    });

    test("sends response with status code 400 when non legit Objectid is sent", async () => {
        const testUser = helper.userCompliant;
        await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);
        
        await api.delete("/api/blogs/bullshitID").set("Authorization", `bearer ${userToken}`).expect(400);
    });

    test("responds with status code 401 when authorization header not included", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const randomBlogId = randomBlog._id.toString();
        await api.delete(`/api/blogs/${randomBlogId}`).expect(401);
    });

    test("responds with status code 401 when authorization header does not start wtih 'bearer'", async () => {
        const testUser = helper.userCompliant;

        await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);
        const randomBlog = await helper.randomBlogInDb();
        const randomBlogId = randomBlog._id.toString();
        await api.delete(`/api/blogs/${randomBlogId}`).set("Authorization", userToken).expect(401);
    });

    test("responds with status code 401 when invalid token is sent in authorization header", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = helper.getUserTokenWrongSecret(testUser);

        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();
        await api.delete(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).expect(401);
    });

    test("responds with status code 403 when user id in token does not match blog's 'user'", async () => {
        // testUser stores article in DB and altTestUser then tries to delete - should be forbidden
        const testUser = helper.userCompliant;
        const altTestUser = helper.alternativeUserCompliant;
        const testBlog = helper.singleBlogComplete;

        const testUserId = await helper.saveUserToDb(testUser);
        await helper.saveUserToDb(altTestUser);
        const altUserToken = await helper.getUserToken(altTestUser);

        testBlog.user = testUserId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogCountInDbBefore = await helper.blogCountInDb();
        const blogId = savedBlog._id.toString();
        await api.delete(`/api/blogs/${blogId}`).set("Authorization", `bearer ${altUserToken}`).expect(403);

        const blogCountInDbAfter = await helper.blogCountInDb();

        expect(blogCountInDbBefore).toEqual(blogCountInDbAfter);
    });
});

describe("PATCH /api/blogs/:id", () => {
    test("sends response with 404 status code using non-existent legit ObjectId", async () => {
        const testUser = helper.userCompliant;

        await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);

        const id = await helper.nonExistingId();
        await api.patch(`/api/blogs/${id}`).set("Authorization", `bearer ${userToken}`).expect(404);
    });

    test("sends response with 400 status code when non legit ObjectId is sent", async () => {
        const testUser = helper.userCompliant;

        await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);
        
        await api.patch("/api/blogs/bulshitID").set("Authorization", `bearer ${userToken}`).expect(400);
    });

    test("count of documents remains unchanged when sending empty body & existing ID", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogCountInDbBefore = await helper.blogCountInDb();
        
        const id = savedBlog._id.toString();
        await api.patch(`/api/blogs/${id}`).set("Authorization", `bearer ${userToken}`).expect(200);
        const blogCountInDbAfter = await helper.blogCountInDb()
        expect(blogCountInDbBefore).toEqual(blogCountInDbAfter);
    });

    test("likes update correctly when existing ID is sent and status code is 200", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await helper.getUserToken(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();

        let likesBefore = testBlog.likes;
        let incrementedLikes = likesBefore + 1;

        await api.patch(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).send({likes: incrementedLikes}).expect(200);
        const testBlogUpdated = await helper.getBlogByIdInDb(blogId);
        expect(testBlogUpdated.likes).toEqual(incrementedLikes);
        expect(testBlogUpdated.likes - testBlog.likes).toEqual(1);
    });

    test("title, url, author and likes update correctly in db and status code is 200", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;
        const testBlogUpdate = helper.altSingleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();
        
        await api.patch(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).send(testBlogUpdate).expect(200);
        const updatedTestBlog = await helper.getBlogByIdInDb(blogId);
        expect(updatedTestBlog.title).toEqual(testBlogUpdate.title);
        expect(updatedTestBlog.author).toEqual(testBlogUpdate.author);
        expect(updatedTestBlog.url).toEqual(testBlogUpdate.url);
        expect(updatedTestBlog.likes).toEqual(testBlogUpdate.likes);
    });

    test("title, url, author and likes update correctly in response and status code is 200", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;
        const testBlogUpdate = helper.altSingleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();

        const response = await api.patch(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).send(testBlogUpdate).expect(200);
        const updatedBlogResponse = response.body;
        expect(updatedBlogResponse.title).toEqual(testBlogUpdate.title);
        expect(updatedBlogResponse.author).toEqual(testBlogUpdate.author);
        expect(updatedBlogResponse.url).toEqual(testBlogUpdate.url);
        expect(updatedBlogResponse.likes).toEqual(testBlogUpdate.likes);
    });

    test("does not add attribute which is not part of model", async () => {
        const testUser = helper.userCompliant;
        const testBlog = helper.singleBlogComplete;
        const testBlogUpdate = helper.altSingleBlogComplete;

        const userId = await helper.saveUserToDb(testUser);
        const userToken = await await helper.getUserToken(testUser);
        testBlog.user = userId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();

        await api.patch(`/api/blogs/${blogId}`).set("Authorization", `bearer ${userToken}`).send({dislikes: 1000});
        const updatedBlog = await helper.getBlogByIdInDb(blogId);
        expect(updatedBlog.dislikes).toBeUndefined();
    });

    test("responds with status code 403 when user id in token does not match blog's 'user'", async () => {
        // testUser stores article in DB and altTestUser then tries to update - should be forbidden
        const testUser = helper.userCompliant;
        const altTestUser = helper.alternativeUserCompliant;
        const testBlog = helper.singleBlogComplete;

        const testUserId = await helper.saveUserToDb(testUser);
        await helper.saveUserToDb(altTestUser);
        const altUserToken = await helper.getUserToken(altTestUser);

        testBlog.user = testUserId;
        const blog = new Blog(testBlog);
        const savedBlog = await blog.save();
        const blogId = savedBlog._id.toString();

        await api.patch(`/api/blogs/${blogId}`).set("Authorization", `bearer ${altUserToken}`).send({title: "New Title"}).expect(403);
        const hopefullyNotUpdatedBlog = await helper.getBlogByIdInDb(blogId);
        expect(hopefullyNotUpdatedBlog.title).toEqual(testBlog.title);
    });

    test("responds with status code 401 when authorization not included", async () => {
        const randomBlog = await helper.randomBlogInDb();
        const id = randomBlog._id.toString();
        await api.patch(`/api/blogs/${id}`).expect(401);
    });
});

describe("POST /api/users", () => {
    test("saves user to db with correct username, name and password hash when reqs fulfilled", async () => {
        const testUser = helper.userCompliant;
        
        await api.post("/api/users").send(testUser).expect(201);
        const userInDb = await User.findOne({username: testUser.username});
        expect(userInDb.name).toEqual(testUser.name);
        expect(userInDb.username).toEqual(testUser.username);
        const passwordCorrect = await bcrypt.compare(testUser.password, userInDb.passwordHash);
        expect(passwordCorrect).toBe(true);
    });

    test("does not save user to db when username is less than 3 chars and sends 400 status code", async () => {
        const testUser = helper.userShortUsername;

        await api.post("/api/users").send(testUser).expect(400);
        const userInDb = await User.findOne({username: testUser.username});
        expect(userInDb).toBeFalsy();
    });

    test("does not save user to db when password is less than 3 chars and send 400 status code", async () => {
        const testUser = helper.userShortPassword;
        
        await api.post("/api/users").send(testUser).expect(400);
        const userInDb = await User.findOne({username: testUser.username});
        expect(userInDb).toBeFalsy();
    });

    test("does not save user to db when user with same username exists and sends 400 status code", async () => {
        const testUser = helper.userCompliant;
        await helper.saveUserToDb(testUser);
        await api.post("/api/users").expect(400);
        let usersWithUsername = await User.find({username: testUser.username});
        expect(usersWithUsername.length).toEqual(1);
    });

    test("sends correct data and no password in response when reqs fulfilled", async () => {
        const testUser = helper.userCompliant;
        const response = await api.post("/api/users").send(testUser).expect(201);
        expect(response.body.username).toEqual(testUser.username);
        expect(response.body.name).toEqual(testUser.name);
        expect(response.body.password).toBeUndefined();
        expect(response.body.passwordHash).toBeUndefined();
    });
});

describe("POST /api/login", () => {
    test("responds with correct username, name, valid token and status code 200 when correct creds are given", async () => {
        const testUser = helper.userCompliant;
        const userId = await helper.saveUserToDb(testUser);
        const response = await api.post("/api/login").send(testUser).expect(200);
        expect(response.body.username).toEqual(testUser.username);
        expect(response.body.name).toEqual(testUser.name);
        const decodedToken = jwt.verify(response.body.token, config.JWT_SECRET)
        expect(decodedToken.id.toString()).toEqual(userId.toString());
        expect(decodedToken.username).toEqual(testUser.username);
    });

    test("responds with status code 401 when invalid username is given", async () => {
        await api.post("/api/login").send(helper.userCompliant).expect(401);
    });

    test("responds with status code 401 when invalid password is given", async () => {
        const testUser = helper.userCompliant;
        const userId = await helper.saveUserToDb(testUser);
        await api.post("/api/login").send({username: testUser.username, password: "fakepassword"}).expect(401);
    });
});
