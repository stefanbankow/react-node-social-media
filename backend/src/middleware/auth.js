const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtSecret = process.env.JWT_SECRET || "secret";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_access;

    const decodedToken = jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        throw err;
      }
      return decodedToken;
    });

    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    if (!user) {
      console.error("Unauthorized");
      return res.status(401).json({ error: "No user found with this token" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error });
  }
};

module.exports = auth;
