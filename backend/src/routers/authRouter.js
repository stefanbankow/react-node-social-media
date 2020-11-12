const express = require("express");
const User = require("../models/user");

//Middleware
const auth = require("../middleware/auth");

const authRouter = express.Router();
//Used to auth the user on refresh, basically just runs the auth middleware on connect and returns the login data
authRouter.get("/auth", auth, (req, res) => {
  return res.status(201).json({
    userId: req.user._id,
    token: req.token,
    username: req.user.username,
  });
});

authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    await user.save();

    res.cookie("jwt_access", token, { httpOnly: true, sameSite: true });
    return res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});

authRouter.get("/logout", auth, async (req, res) => {
  try {
    const tokenToDelete = req.token;
    const indexOfToken = req.user.tokens.findIndex(
      (tokenObj) => tokenObj.token === tokenToDelete
    );

    req.user.tokens.splice(indexOfToken, 1);
    await req.user.save();
    return res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

module.exports = authRouter;
