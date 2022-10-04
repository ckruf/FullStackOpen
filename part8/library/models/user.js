const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minglength: 3
  },
  favouriteGenre: {
    type: String,
    minLength: 3,
    required: true
  },
})

module.exports = mongoose.model("User", schema);