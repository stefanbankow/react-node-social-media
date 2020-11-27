const mongoose = require("../db/mongoose");
const eventEmitter = require("../events/eventEmitter");
const Post = require("./post");
const Notification = require("./notification");

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

likeSchema.post("save", async function () {
  const post = await Post.findById(this.onPost);

  //Check if the user is liking his/her own post and only send notification if that's not the case
  if (post && post.author.toString() !== this.by.toString()) {
    try {
      const notificationObject = {
        by: this.by,
        to: post.author,
        onPost: post._id,
        type: "like",
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

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
