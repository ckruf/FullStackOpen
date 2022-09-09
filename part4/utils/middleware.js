const logger = require("./logger");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
    logger.info("Method: ", req.method);
    logger.info("Path: ", req.path);
    logger.info("Body: ", req.body);
    logger.info("---");
    next();
};

const tokenExtractor = (req, res, next) => {
    // get authorization header in request
    const authorization = req.get("authorization");

    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        const encodedToken = authorization.substring(7);
        const decodedToken = jwt.verify(encodedToken, config.JWT_SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({error: "invalid token"});
        }
        req.token = decodedToken;
    }
    else {
        return res.status(401).json({error: "authorization header not present or wrong format"});
    }
    next();
}

const userExtractor = async (req, res, next) => {
    if (!req.token.id) {
        return res.status(401).json({error: "invalid token"});
    }

    const user = await User.findById(req.token.id);
    if (!user) {
        return res.status(404).json({error: "user not found"});
    }
    req.user = user;
    next();
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).send({error: "could not cast id to ObjectId"});
    }
    else if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({error: error.message});
    }
    else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({error: "invalid token"});
    }
    else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({error: "expired token"});
    }

    next(error);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
};