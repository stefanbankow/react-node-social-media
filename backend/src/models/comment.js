const mongoose = require("../db/mongoose");
const Post = require("./post");
const Notification = require("./notification");
const eventEmitter = require("../events/eventEmitter");

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

CommentSchema.post("save", async function () {
  const post = await Post.findById(this.onPost);

  //Check if the user is commenting his/her own post and only send notification if that's not the case
  if (post && post.author.toString() !== this.author.toString()) {
    try {
      const notificationObject = {
        by: this.author,
        to: post.author,
        onPost: post._id,
        commentId: this._id,
        type: "comment",
      };
      const notification = new Notification(notificationObject);
      await notification.save();
      await notification
        .populate({ path: "onPost", select: "author title" })
        .populate({ path: "by", select: "username" })
        .execPopulate();

      eventEmitter.emit("new notification", notification, post.author);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
});

const CommentOnPost = mongoose.model("Comment", CommentSchema);

module.exports = CommentOnPost;
