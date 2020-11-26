const mongoose = require("../db/mongoose");

const notificationSchema = new mongoose.Schema({
  by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  onPost: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: mongoose.Types.ObjectId,
    ref: "Comment",
  },
  type: {
    type: String,
    enum: ["comment", "like"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
