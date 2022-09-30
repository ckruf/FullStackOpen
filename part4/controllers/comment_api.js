const commentApiRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

commentApiRouter.post("/:id", tokenExtractor, userExtractor, async (req, res, next) => {
  logger.info("POST comment");
  const blogId = req.params.id;
  logger.info("blogId: ", blogId)
  const commentData = req.body;
  logger.info("commentData: ", JSON.stringify(commentData));
  commentData.author = req.user.username;
  commentData.created_datetime = Date.now();


  try {
    let potentialBlog = await Blog.findById(blogId);
    if (!potentialBlog) {
      logger.info("No blog found with given id")
      return res.status(404).json({error: "blog with given id does not exist"});
    }
    logger.info(`potentialBlog: ${JSON.stringify(potentialBlog)}`);
    potentialBlog.comments.push(commentData);
    await potentialBlog.save();
    return res.status(200).json(potentialBlog);
  } catch (error) {
    logger.error("Got an error while adding new comment to DB");
    next(error);
  }
});

module.exports = commentApiRouter;