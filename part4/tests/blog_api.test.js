const Blog = require("../models/blog");
const helper = require("./test_helper");


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