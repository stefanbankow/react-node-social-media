const express = require("express");
const auth = require("../middleware/auth");
const CommentOnPost = require("../models/comment");

const commentRouter = express.Router({ mergeParams: true });

//Get all comments on post
commentRouter.get("/", async (req, res) => {
  const comments = await CommentOnPost.find({
    onPost: req.params.postId,
  }).populate("author");
  res.json({ comments, onPost: req.params.postId });
});

//Add a new comment to post
commentRouter.post("/", auth, async (req, res) => {
  try {
    const newComment = await new CommentOnPost({
      author: req.user._id,
      onPost: req.params.postId,
      content: req.body.content,
    }).save();
    await newComment.populate("author").execPopulate();
    return res.json({ comment: newComment });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});

//Update a comment
commentRouter.patch("/:commentId", auth, async (req, res) => {
  try {
    if (req.body.content) {
      const commentToUpdate = await CommentOnPost.findOne({
        _id: req.params.commentId,
        author: req.user._id,
      });
      if (!commentToUpdate) {
        return res.status(404).json({ error: "No comment to update" });
      }

      commentToUpdate.content = req.body.content;
      await commentToUpdate.save();
      await commentToUpdate.populate("author").execPopulate();
      return res.json({ updatedComment: commentToUpdate });
    } else {
      return res
        .status(400)
        .json({ error: "Only the content field can be updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

//Delete a comment
commentRouter.delete("/:commentId", auth, async (req, res) => {
  try {
    const commentToDelete = await CommentOnPost.findOneAndDelete({
      _id: req.params.commentId,
      author: req.user._id,
    });

    if (!commentToDelete) {
      return res.status(404).json({ error: "No comment with this id found" });
    }

    return res.status(204).json({ deletedComment: commentToDelete });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

module.exports = commentRouter;
