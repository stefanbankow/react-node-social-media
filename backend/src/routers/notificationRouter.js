const express = require("express");
const Notification = require("../models/notification");
const auth = require("../middleware/auth");

const eventEmitter = require("../events/eventEmitter");

const notificationRouter = express.Router();

notificationRouter.get("/", auth, async (req, res) => {
  const currentDate = Date.now();
  try {
    const notifications = await Notification.find({
      to: req.user._id,
      createdAt: { $lt: req.query.before || currentDate },
    })
      .limit(10)
      .sort({
        createdAt: -1,
      })
      .populate({ path: "onPost", select: "author title" })
      .populate({ path: "by", select: "username" });

    if (!req.query.before) {
      const notificationCount = await Notification.countDocuments({
        to: req.user._id,
      });
      const unreadNotificationCount = await Notification.countDocuments({
        to: req.user._id,
        read: false,
      });
      return res.json({
        notifications,
        notificationCount,
        unreadNotificationCount,
      });
    }

    return res.json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

notificationRouter.patch("/read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        read: false,
        to: req.user._id,
      },
      { $set: { read: true } }
    );

    eventEmitter.emit("read notifications", req.user._id);
    return res.json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

module.exports = notificationRouter;
