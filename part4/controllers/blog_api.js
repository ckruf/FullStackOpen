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
});

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
});


blogApiRouter.delete("/:id", async (req, res, next) => {
    let id = req.params.id;
    try {
        let potentialBlog = await Blog.findById(id);
        logger.info("potentialBlog: ", potentialBlog);
        logger.info("potentialBlog: ", JSON.stringify(potentialBlog));
        if (!potentialBlog) {
            logger.info("No blog found with given id")
            return res.status(404).json({error: "Blog with given id does not exist"});
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


blogApiRouter.patch("/:id", async (req, res, next) => {
    let id = req.params.id;
    try {
        let updatedBlog = Blog.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true, conext: 'query'}
        );
        return res.json(updatedBlog);
    }
    catch (error) {
        logger.error("Error while updating blog");
        next(error);
    }
})

module.exports = blogApiRouter;