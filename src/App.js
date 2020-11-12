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
import { checkAuthAsync } from "./store/actions/index";
import { useEffect } from "react";
import UserProfile from "./containers/UserProfile/UserProfile";

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

function App(props) {
  const { onRefresh } = props;
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);
  return (
    <ThemeProvider theme={muiTheme}>
      {/*Here a Route is used because otherwise the links inside would not be able to pass down the
      location pathname as props.location.state */}
      <Route path="/" component={NavbarLayout} />

      <Switch>
        <Route path="/signup" component={SignupForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/test" render={() => <h1>Test page</h1>} />
        <Route path="/:username" component={UserProfile} />

        <Route exact path="/" component={HomePage} />
      </Switch>
    </ThemeProvider>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRefresh: () => dispatch(checkAuthAsync()),
  };
};

export default connect(null, mapDispatchToProps)(App);
