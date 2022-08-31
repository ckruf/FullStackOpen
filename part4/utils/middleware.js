const logger = require("./logger");
const mongoose = require("mongoose");
const { response } = require("express");

const requestLogger = (req, res, next) => {
    logger.info("Method: ", req.method);
    logger.info("Path: ", req.path);
    logger.info("Body: ", req.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (req, res) => {
    response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).send({error: "could not cast id to ObjectId"});
    }
    else if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({error: error.message});
    }

    next(error);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};