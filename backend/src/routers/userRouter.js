const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Post = require("../models/post");
const CommentOnPost = require("../models/comment");
const multer = require("multer");
const sharp = require("sharp");

//Middleware
const auth = require("../middleware/auth");

//Routers
const authRouter = require("./authRouter");
const userRouter = express.Router();

userRouter.use("", authRouter);

userRouter.post("/", async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
    });
    const token = await newUser.generateAuthToken();

    await newUser.save();
    res.cookie("jwt_access", token, { httpOnly: true, sameSite: true });
    return res.status(201).json({ newUser, userId: newUser._id, token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error });
  }
});

userRouter.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //The populates are getting pretty nested, which is something I do not like, but have to live with for now
    await user
      .populate({
        path: "posts",
        populate: {
          path: "likes",
          select: "by",
          options: { sort: { createdAt: 1 } },
          populate: {
            path: "by",
            select: "username",
          },
        },
      })
      .populate("postCount")
      .execPopulate();
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.patch("/", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["about", "age", "country"];
    const updatesToDo = updates.filter((update) => {
      return allowedUpdates.indexOf(update) >= 0;
    });

    updatesToDo.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    return res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error });
  }
});

userRouter.patch("/change-password", auth, async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword;
    if (oldPassword) {
      const match = await bcrypt.compare(oldPassword, req.user.password);
      if (match) {
        req.user.password = req.body.newPassword;
        await req.user.save();

        return res.json({ user: req.user });
      } else {
        //Using this structure of the error so I can easily handle both oldPass and newPass errors in the frontend later
        return res.status(400).json({
          error: {
            errors: { oldPassword: { message: "This password is incorrect" } },
          },
        });
      }
    } else {
      return res.status(400).json({
        error: {
          errors: { oldPassword: { message: "This field is required" } },
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});

userRouter.delete("/", auth, async (req, res) => {
  try {
    //Wanted to do this all in "pre"/"post" methods in the models, but couldn't find a proper way to do it so I'm stuck with deleting them manually for now

    const deletedPosts = await Post.find({ author: req.user._id });

    deletedPosts.forEach((post) => {
      CommentOnPost.deleteMany({ onPost: post._id })
        .then(() => {
          return post.deleteOne();
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ error });
        });
    });

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    return res.json({ deletedUser });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb("Please upload an PNG, JPG/JPEG image file");
    }
  },
});

/* Storing the avatar this way is very, very inefficient, because it makes the response sizes enormous. I am using it for development purposes, since
it is relatively simple and the response size does not make such a big difference while testing locally.
For production builds, though, it is better to use an online bucket(Amazon s3 for example) and use MongoDB to only store references to 
the images uploaded to the bucket */
userRouter.post("/profile_pic", auth, (req, res) => {
  upload.single("avatar")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    try {
      const imgBuffer = await sharp(req.file.buffer)
        .resize(500, 500)
        .png()
        .toBuffer();

      req.user.avatar = imgBuffer;
      await req.user.save();

      return res.json({
        message: "Successfully uploaded image",
        avatar: req.user.avatar.toString("base64"),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  });
});

module.exports = userRouter;
