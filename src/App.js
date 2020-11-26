import React from "react";
import "./App.css";
import NavbarLayout from "./components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import HomePage from "./containers/HomePage/HomePage";
import SignupForm from "./components/Auth/SignupForm/SignupForm";
import { Switch, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm/LoginForm";
import { connect } from "react-redux";
import {
  checkAuthAsync,
  getNotificationsAsync,
  newNotification,
  readNotifications,
  deleteOneNotification,
  deleteNotifications,
} from "./store/actions/index";
import { useEffect } from "react";
import UserProfile from "./containers/UserProfile/UserProfile";
import DraftsPage from "./containers/DraftsPage/DraftsPage";
import NotFoundPage from "./containers/NotFoundPage/NotFoundPage";
import TestPage from "./containers/TestPage/TestPage";
import io from "socket.io-client";

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffab00",
      light: "#ffdd4b",
      dark: "#c67c00",
      contrastText: "",
    },
    secondary: {
      main: "#3d5afe",
      light: "#8187ff",
      dark: "#0031ca",
      contrastText: "",
    },
  },
});

let socket = null;

function App(props) {
  const {
    onRefresh,
    onGetNotifications,
    authUserId,
    onNewNotification,
    onReadNotifications,
    onDeleteNotifications,
    onDeleteOneNotification,
  } = props;

  useEffect(() => {
    onRefresh();

    if (authUserId) {
      onGetNotifications();
      socket = io();
      socket.on("connect", () => {
        socket.emit("join room with userId", authUserId);
      });

      socket.on("newNotification", (notification) => {
        onNewNotification(notification);
      });

      socket.on("read notifications", () => {
        onReadNotifications();
      });

      socket.on("delete notifications", (notificationIds) => {
        onDeleteNotifications(notificationIds);
      });

      socket.on("delete one notification", (notificationId) => {
        onDeleteOneNotification(notificationId);
      });
    }
    return () => {
      socket && socket.disconnect();
    };
  }, [
    onRefresh,
    authUserId,
    onGetNotifications,
    onNewNotification,
    onReadNotifications,
    onDeleteNotifications,
    onDeleteOneNotification,
  ]);

  return (
    <ThemeProvider theme={muiTheme}>
      {/*Here a Route is used to render the Navbar because otherwise the links inside would not be able to pass down the
      location pathname as props.location.state */}
      <Route path="/" component={NavbarLayout} />

      <Switch>
        <Route exact path="/signup" component={SignupForm} />
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/test" component={TestPage} />
        <Route exact path="/drafts" component={DraftsPage} />
        <Route path="/users/:username" component={UserProfile} />
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    authUserId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRefresh: () => dispatch(checkAuthAsync()),
    onGetNotifications: () => dispatch(getNotificationsAsync()),
    onNewNotification: (notification) =>
      dispatch(newNotification(notification)),
    onReadNotifications: () => dispatch(readNotifications()),
    onDeleteOneNotification: (notificationId) =>
      dispatch(deleteOneNotification(notificationId)),
    onDeleteNotifications: (notificationIds) =>
      dispatch(deleteNotifications(notificationIds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
