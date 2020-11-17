const express = require("express");
const auth = require("../middleware/auth");
const Like = require("../models/like");
const Post = require("../models/post");

const likeRouter = express.Router({ mergeParams: true });

likeRouter.post("/", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "No post with this id found" });
    }
    const likeCheck = await Like.findOne({
      onPost: req.params.postId,
      by: req.user._id,
    });
    if (likeCheck) {
      return res.status(400).json({ error: "Already liked" });
    }
    const newLike = new Like({ onPost: req.params.postId, by: req.user._id });
    await newLike.save();
    await newLike.populate("by").execPopulate();
    return res.json({ newLike });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

likeRouter.delete("/", auth, async (req, res) => {
  try {
    const likeToDelete = await Like.findOneAndDelete({
      by: req.user._id,
      onPost: req.params.postId,
    });
    if (!likeToDelete) {
      return res.status(404).json({ error: "No like to delete" });
    }
    return res.json({ deletedLike: likeToDelete });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

module.exports = likeRouter;
