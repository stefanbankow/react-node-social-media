const express = require("express");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const notificationRouter = require("./routers/notificationRouter");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);
const eventEmitter = require("./events/eventEmitter");

const mongoose = require("./db/mongoose");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
}); */

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/notifications", notificationRouter);

app.get("/", (req, res) => {
  res.json("Successfully sent request");
});

io.on("connection", (socket) => {
  socket.on("join room with userId", (userId) => {
    socket.join(userId);
    console.log("Joined room with userId: " + userId);
  });
});

eventEmitter.on("new notification", (notification, userId) => {
  io.to(userId.toString()).emit("newNotification", notification);
});

eventEmitter.on("read notifications", (userId) => {
  io.to(userId.toString()).emit("read notifications");
});

eventEmitter.on("delete notifications", (notificationIds, userId) => {
  io.to(userId.toString()).emit("delete notifications", notificationIds);
});

eventEmitter.on("delete one notification", (notificationId, userId) => {
  io.to(userId.toString()).emit("delete one notification", notificationId);
});

mongoose.connection.once("open", () => {
  http.listen(port, () => {
    console.log("Listening on " + port);
  });
});
