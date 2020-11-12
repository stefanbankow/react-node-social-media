const mongoose = require("mongoose");

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/social-media-rest-react";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = mongoose;
