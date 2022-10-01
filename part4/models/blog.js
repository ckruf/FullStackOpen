const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  content: {
    type: String,
    minLength: 4,
    required: true
  },
  created_datetime: Date
})

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        required: true
    },
    author: {
        type: String,
        minLength: 2,
        required: true
    },
    url: {
        type: String,
        minlength: 5,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema],
  }, {
    strict: true
  });

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        if (returnedObject.comments) {
          returnedObject.comments.forEach(comment => {
            delete comment.author;  // comments are "anonymous ;-)"
            comment.id = comment._id.toString();
            delete comment._id;
          })
        }
    }
})

module.exports = mongoose.model("Blog", blogSchema);