const blogApiRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

blogApiRouter.get("", async (req, res, next) => {
    try {
        let allBlogs = await Blog.find({}).populate('user');
        return res.json(allBlogs);
    }
    catch (error) {
        logger.error("Got an error while fetching all blog posts from db");
        next(error);
    }
});

blogApiRouter.post("", tokenExtractor, userExtractor, async (req, res, next) => {
    const blogData = req.body;
    blogData.user = req.user._id;

    const newBlog = new Blog(blogData);

    try {
        let savedBlog = await newBlog.save();
        return res.status(201).json(savedBlog);
    }
    catch (error) {
        logger.error("Got an error while saving new blog to db");
        next(error);
    }
});


blogApiRouter.delete("/:id", tokenExtractor, userExtractor, async (req, res, next) => {
    let id = req.params.id;
    // check if blog exists and if user matches token
    try {
        let potentialBlog = await Blog.findById(id);
        logger.info("potentialBlog: ", potentialBlog);
        logger.info("potentialBlog: ", JSON.stringify(potentialBlog));
        if (!potentialBlog) {
            logger.info("No blog found with given id")
            return res.status(404).json({error: "blog with given id does not exist"});
        }
        if (potentialBlog.user !== req.user._id.toString()) {
            return res.status(403).json({error: "provided credentials do not match user who posted blog"});
        }
    }
    catch (error) {
        logger.error("Got an error while fetching blog from DB");
        next(error);
    }

    try {
        await Blog.findByIdAndDelete(id);
        return res.status(204).send();
    }
    catch (error)
    {
        logger.error("Got an error while deleting blog from DB");
        next(error);
    }
    
});


blogApiRouter.patch("/:id", tokenExtractor, userExtractor, async (req, res, next) => {
    let id = req.params.id;
    // check if blog exists and if user matches token
    try {
        const potentialBlog = await Blog.findById(id);
        if (!potentialBlog) {
            return res.status(404).json({error: "blog with given id not found"});
        }
        if (potentialBlog.user !== req.user._id.toString()) {
            return res.status(403).json({error: "provided credentials do not match user who posted blog"});
        }
    } 
    catch (error) {
        logger.error("Got an error while finding blog and checking user id");
        next(error);
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true, context: 'query'}
        );
        return res.json(updatedBlog);
    }
    catch (error) {
        logger.error("Error while updating blog");
        next(error);
    }
})

module.exports = blogApiRouter;