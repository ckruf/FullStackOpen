const testingRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// endpoint to clear database for Cypress testing
testingRouter.delete("/reset", async (req, res) => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    return res.status(204).end();
});

module.exports = testingRouter;