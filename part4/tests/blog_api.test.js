const Blog = require("../models/blog");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");

// !!! Remember to start your docker MongoDB for testing first !!!

// wraps app in supertest function, to create a so called superagent object,
// which "provides a high level abstraction for testing HTTP.
// allows us to send requests to the app without explicitly starting it, setting up ports etc.
const api = supertest(app);


// setup function to run before each test to delete all existing blogs from database
// and add test data
beforeEach(async () => {
    await Blog.deleteMany({});

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
        const blogsInDb = await helper.blogsInDb();
        const blogCountInDb = blogsInDb.length;
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
});

describe("POST /api/blogs", () => {
    test("document count in DB increases by 1 when complete JSON is sent", async () => {
        const blogsInDbBefore = await helper.blogsInDb();
        const blogCountInDbBefore = blogsInDbBefore.length;
        await api.post("/api/blogs").send(helper.singleBlogComplete);
        const blogsInDbAfter = await helper.blogsInDb();
        const blogCountInDbAfter = blogsInDbAfter.length;
        const addedBlogs = blogCountInDbAfter - blogCountInDbBefore;
        expect(addedBlogs).toEqual(1);
    });

    test("saves blog to DB with correct content (checked in DB, not response)", async () => {
        await api.post("/api/blogs").send(helper.singleBlogComplete);
        const blogsInDb = await helper.blogsInDb();
        const blogsInDbNoId = blogsInDb.map(blog => delete blog.id);
        expect(blogsInDb).toContainEqual(helper.singleBlogComplete);
    });

    test("default 'likes' to 0 if missing from sent JSON (checked in DB, not response)", async () => {
        await api.post("/api/blogs").send(helper.singleBlogMissingLikes);
        const blogsInDb = await helper.blogsInDb();
        const addedBlog = blogsInDb.find(blog => {
            return (blog.title = helper.singleBlogMissingLikes.title
                && blog.author === helper.singleBlogMissingLikes.author
                && blog.url === helper.singleBlogMissingLikes.url)
        });
        expect(addedBlog.likes).toEqual(0);
    });

    test("responds with status code 400 when title is missing from request data", async () => {
        await api.post("/api/blogs").send(helper.singleBlogMissingTitle).expect(400);
    });

    test("responds with status code 400 when url is missing from request data", async () => {
        await api.post("/api/blogs").send(helper.singleBlogMissingUrl).expect(400);
    });
});