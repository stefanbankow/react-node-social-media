const mongoose = require("../db/mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  onPost: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  content: {
    type: String,
    required: "This field cannot be empty",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentOnPost = mongoose.model("Comment", CommentSchema);

module.exports = CommentOnPost;
