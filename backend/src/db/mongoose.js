const mongoose = require("mongoose");

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/social-media-rest-react";

const keepAliveConnection = () => {
  console.log("Attempting to connect to MongoDB database...");
  mongoose.connect(
    mongoUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        console.error("Failed to connect to database - retrying in 5 seconds");
        setTimeout(keepAliveConnection, 5000);
      }
    }
  );
};

keepAliveConnection();

module.exports = mongoose;
