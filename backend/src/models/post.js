const mongoose = require("../db/mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "This field is required",
    },
    content: {
      type: String,
      required: "This field is required",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    public: {
      type: Boolean,
      default: true,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "onPost",
});

PostSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "onPost",
  count: true,
});

PostSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "onPost",
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
