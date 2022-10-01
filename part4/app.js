const mongoose = require("mongoose");
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogApiRouter = require("./controllers/blog_api");
const userApiRouter = require("./controllers/users_api");
const loginApiRouter = require("./controllers/login_api");

logger.info("Connecting to ", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB");
    })
    .catch(error => {
        logger.error("Error connecting to MongoDB: ", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogApiRouter);
app.use("/api/users", userApiRouter);
app.use("/api/login", loginApiRouter);

// if we are running in test environment, expose testingApi EP for resetting database 
if (process.env.NODE_ENV === "test") {
    const testingApiRouter = require("./controllers/testing");
    app.use("/api/testing", testingApiRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;