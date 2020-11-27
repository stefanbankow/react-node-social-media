const express = require("express");
const eventEmitter = require("../events/eventEmitter");
const auth = require("../middleware/auth");
const CommentOnPost = require("../models/comment");
const Like = require("../models/like");
const Notification = require("../models/notification");
const Post = require("../models/post");
const commentRouter = require("./commentRouter");
const likeRouter = require("./likeRouter");

const postRouter = express.Router();

postRouter.use("/:postId/comments", commentRouter);
postRouter.use("/:postId/likes", likeRouter);

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

/*This route returns a limited amount of posts + the total count of posts. If no lastPostDate query is present, it returns the most recent posts.
    The reason i am creating a variable currentDate is I have to make 2 separate queries (one for the posts + content and another for the count).
    If I had used 2 separate Date.now() calls, the results would be inconsistent since a little time would have passed between them and there is
    a chance (albeit a small one) that more posts have been added to the collection during that interval.*/
postRouter.get("/", async (req, res) => {
  try {
    /*I wondered whether or not I should use skip for the "pagination", but I read somewhere it can get expensive to use skip. In addition, I believe using
    the current date as a filter is more consistent than using skip.*/
    const currentDate = Date.now();
    const posts = await Post.find({
      public: true,

      //Return all posts created before a specific date if specified in query, otherwise returns all posts created before now (which is essentially every post the user can see)
      createdAt: { $lt: req.query.lastPostDate || currentDate },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author")

      .populate({
        path: "likes",
        select: "by",
        options: { sort: { createdAt: 1 } }, //Not sure if the sort is required, but I'm using it just in case
        populate: {
          path: "by",
          select: "username avatar",
        },
      });

    //The count is required only on the initial request
    if (!req.query.lastPostDate) {
      const postCount = await Post.countDocuments({
        public: true,
        createdAt: { $lt: currentDate },
      });
      return res.json({ posts, postCount });
    }

    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

postRouter.get("/users/:userId", async (req, res) => {
  try {
    const currentDate = Date.now();
    const posts = await Post.find({
      public: true,
      createdAt: { $lt: req.query.lastPostDate || currentDate },
      author: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author")
      .populate({
        path: "likes",
        select: "by",
        options: { sort: { createdAt: 1 } }, //Same as above, not sure if the sort is required, but I'm using it just in case
        populate: {
          path: "by",
          select: "username",
        },
      });

    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

postRouter.get("/drafts", auth, async (req, res) => {
  try {
    const drafts = await Post.find({
      author: req.user._id,
      public: false,
    })
      .sort({ createdAt: -1 })
      .populate("author");
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

    const likesToDelete = await Like.deleteMany({ onPost: postToDelete._id });

    const notificationsToDelete = await Notification.find({
      onPost: postToDelete._id,
    });

    if (notificationsToDelete) {
      const notificationIds = notificationsToDelete.map(
        (notification) => notification._id
      );
      await Notification.deleteMany({ onPost: postToDelete._id });
      eventEmitter.emit(
        "delete notifications",
        [...notificationIds],
        req.user._id
      );
    }

    return res.json({
      deletedPost: postToDelete,
      deletedComments: commentsToDelete,
      deletedLikes: likesToDelete,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = postRouter;
