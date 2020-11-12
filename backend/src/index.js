const express = require("express");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const app = express();

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

app.get("/", (req, res) => {
  res.json("Successfully sent request");
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
