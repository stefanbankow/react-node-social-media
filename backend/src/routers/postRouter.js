const express = require("express");
const auth = require("../middleware/auth");
const CommentOnPost = require("../models/comment");
const Post = require("../models/post");
const commentRouter = require("./commentRouter");

const postRouter = express.Router();

postRouter.use("/:postId/comments", commentRouter);

postRouter.post("/", auth, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      public: req.body.public,
      author: req.user._id,
    });

    await newPost.save();

    await newPost.populate("author").execPopulate();

    return res.json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ public: true })
      .sort({ createdAt: -1 })
      .populate("author")
      .populate("lastComment")
      .populate("commentCount");
    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

postRouter.get("/me", auth, async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    return res.json({ posts });
  } catch (error) {}
});

postRouter.get("/drafts", auth, async (req, res) => {
  try {
    const drafts = await Post.find({
      author: req.user._id,
      public: false,
    }).sort({ createdAt: -1 });
    return res.json({ drafts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

postRouter.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate({
        path: "comments",
      })
      .exec();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    } else if (
      post.author._id.toString() === req.user._id.toString() ||
      post.public
    ) {
      return res.json({ post });
    } else {
      return res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

postRouter.patch("/:id", auth, async (req, res) => {
  try {
    const allowedUpdates = ["title", "content", "public"];
    const updatesToDo = Object.keys(req.body).filter(
      (update) => allowedUpdates.indexOf(update) >= 0
    );

    const postToUpdate = await Post.findOne({
      author: req.user._id,
      _id: req.params.id,
    });

    if (!postToUpdate) {
      return res.status(404).json({ error: "Invalid post ID" });
    }

    updatesToDo.forEach((update) => {
      postToUpdate[update] = req.body[update];
    });
    postToUpdate.updated = true;

    await postToUpdate.populate("author").execPopulate();
    await postToUpdate.save();
    return res.json({ updatedPost: postToUpdate });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});

postRouter.delete("/:id", auth, async (req, res) => {
  try {
    const postToDelete = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!postToDelete) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentsToDelete = await CommentOnPost.deleteMany({
      onPost: postToDelete._id,
    });

    return res
      .status(204)
      .json({ deletedPost: postToDelete, deletedComments: commentsToDelete });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = postRouter;
