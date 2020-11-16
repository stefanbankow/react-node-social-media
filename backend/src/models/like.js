const mongoose = require("../db/mongoose");

const likeSchema = new mongoose.Schema({
  by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  onPost: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
