const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "secret";

//Middleware
const auth = require("../middleware/auth");

const authRouter = express.Router();

authRouter.get("/auth", async (req, res) => {
  /* Used to keep the user signed in on refresh, it is very similar to the auth middleware, however this function doesn't return a response if it fails, 
because it would get detected by my error interceptor unnecessarily and the user experience would suffer.
In addition, this function tries to remove an expired authentication token from the database to try and save storage from the database since the expired tokens are
practically useless.
 */
  try {
    const token = req.cookies.jwt_access;
    if (!token) {
      throw new Error("No token in cookies");
    }
    const decodedToken = jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        const user = User.findOne({
          "tokens.token": token,
        })
          .then((user) => {
            user.tokens = user.tokens.filter(
              (tokenObj) => tokenObj.token !== token
            );
            return user.save();
          })
          .catch((err) => {
            console.error(err);
          });

        throw new Error("Token expired");
      }

      return decodedToken;
    });
    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    if (user) {
      return res.status(201).json({
        userId: user._id,
        token: token,
        username: user.username,
      });
    }
  } catch (error) {
    console.error({
      error: "Unsuccessful automatic login attempt",
      reason: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    await user.save();

    res.cookie("jwt_access", token, {
      httpOnly: true,
      sameSite: true,
    });
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
