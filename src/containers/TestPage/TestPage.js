import Axios from "axios";
import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
//import { socket } from "../../App";

const TestPage = (props) => {
  useEffect(() => {
    /*socket.on("connect", () => {
        socket.emit("join room with userId", "alabala");
        socket.emit("send message", userId, "private message");
        */
    /*socket.on("middleware", () => {
      console.log("connected from middleware");
    });
    //  }); */
    //socket.emit("test");

    Axios.get("/test").then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div>
      <h1>Test page</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps)(TestPage);
