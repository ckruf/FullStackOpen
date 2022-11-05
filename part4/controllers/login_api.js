const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");


loginRouter.post("", async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    console.log("user is ", user);

    const compareResult = await bcrypt.compare(password, user.passwordHash);

    console.log("compareResult is ", compareResult);

    const passwordCorrect = user === null
    ? false
    : compareResult;

    console.log()

    if (!(user && passwordCorrect)) {
        return res.status(401).json({error: "invalid username or password"});
    }

    const userInfoToken = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(userInfoToken, config.JWT_SECRET);

    return res.status(200).send({token, username: user.username, name: user.name});
});

module.exports = loginRouter;