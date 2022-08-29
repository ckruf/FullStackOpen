const blogApiRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogApiRouter.get("", async (req, res, next) => {
    try {
        let allBlogs = await Blog.find({});
        return res.json(allBlogs);
    }
    catch (error) {
        logger.error("Got an error while fetching all blog posts from db");
        next(error);
    }
})

blogApiRouter.post("", async (req, res, next) => {
    const newBlog = new Blog(req.body);

    try {
        let savedBlog = await newBlog.save();
        return res.status(201).json(savedBlog);
    }
    catch (error) {
        logger.error("Got an error while saving new blog to db");
        next(error);
    }
})

module.exports = blogApiRouter;