import {
  TextField,
  Typography,
  useMediaQuery,
  CircularProgress,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as actions from "../../../store/actions/index";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "45%",
    margin: "15px auto",
    textAlign: "center",
  },
  errortext: {
    color: "red",
    margin: "20px auto",
  },
  signInButton: {
    marginTop: "25px",
  },
});

const LoginForm = (props) => {
  const classes = useStyles();
  //Using this to change the width on small devices
  const smallScreen = !useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [formInputs, setFormInputs] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const value = event.target.value;
    const field = event.target.name;

    setFormInputs((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSignIn = () => {
    props.onSignIn(formInputs.email, formInputs.password);
  };

  return props.isAuthenticated ? (
    <Redirect
      to={props.location.state ? props.location.state.from.pathname : "/"}
    />
  ) : (
    <div style={{ width: smallScreen && "90%" }} className={classes.root}>
      <Typography variant={smallScreen ? "h2" : "h1"} color="textSecondary">
        Sign in
      </Typography>
      <div>
        <TextField
          onChange={handleChange}
          fullWidth
          error={props.errors.error}
          required
          value={formInputs.email}
          name="email"
          label="Email"
          type="email"
        />
      </div>
      <div>
        <TextField
          onChange={handleChange}
          error={props.errors.error}
          fullWidth
          required
          value={formInputs.password}
          name="password"
          label="Password"
          type="password"
        />
      </div>
      {props.errors.error ? (
        <div className={classes.errortext}>
          <Typography>{props.errors.error}</Typography>
        </div>
      ) : null}
      <div className={classes.signInButton}>
        {props.isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={props.isLoading}
            onClick={handleSignIn}
            variant="contained"
            color="primary"
            size="large"
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (email, password) =>
      dispatch(actions.signInUserAsync(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
