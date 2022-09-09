const usersApiRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");

// create new user with hashed password and unique username
usersApiRouter.post("", async (req, res, next) => {
    const { username, name, password } = req.body;

    // password length has to be checked before hashing, because (I think)
    // you can't check length after it's been hashed (doublecheck)
    if (!password || password.length < 3) {
        return res.status(400).json({error: "password must be at least 3 characters"});
    }
    // check if user with given username already exists
    let potentialUser = await User.findOne({username: username});
    logger.info("potentialUser is:");
    logger.info(potentialUser);

    if (potentialUser) {
        return res.status(400).json({error: "this username already exists"});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({username, passwordHash, name});
    const savedUser = await user.save();

    return res.status(201).json(savedUser);
});

// get all users
usersApiRouter.get("", async () => {
    const allUsers = await User.find({}).populate('blogs');
    return res.json(allUsers);
});

module.exports = usersApiRouter;