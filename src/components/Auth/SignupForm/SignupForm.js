import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { signUpUserAsync } from "../../../store/actions/index";
import { signUpUserFailure } from "../../../store/actions/auth";
import mapPasswordReq from "../../../util/mapPasswordReq";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "45%",
    margin: "15px auto",
    textAlign: "center",
  },
  signUpButton: {
    marginTop: "25px",
  },
});

const SignupForm = (props) => {
  const classes = useStyles();
  //Using this to change the width on small devices
  const smallScreen = !useMediaQuery((theme) => theme.breakpoints.up("md"));
  //Had to initialize all the fields inside this state otherwise React considers the TextFields uncontrolled because of the value property
  //(Or so I think)
  const [formInputs, setFormInputs] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    location: "",
    about: "",
  });

  const handleSignUp = () => {
    if (formInputs.password === formInputs.confirmPassword) {
      props.signUp({ ...formInputs });
    } else {
      /*The error obj has to have this specific structure in order to be able to show this message without changing anything else.
        I am aware that this implementation checks if the passwords match first and only then sends the signup request, but this is not a problem for a sign up*/
      props.signUpFailure({
        password: { message: "Passwords must match" },
        confirmPassword: "Passwords must match",
      });
    }
  };

  function handleChange(event) {
    //event does not work inside the callback function of setFormInputs so I had to declare these constants here
    const field = event.target.name;
    const value = event.target.value;
    setFormInputs((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }
  return props.isAuthenticated ? (
    <Redirect
      /*Checks if the previous page was part of the site and forwards to it after the authentication.
    Otherwise forwards to the home page */
      to={props.location.state ? props.location.state.from.pathname : "/"}
    />
  ) : (
    <form style={{ width: smallScreen && "90%" }} className={classes.root}>
      <Typography variant={smallScreen ? "h2" : "h1"} color="textSecondary">
        Sign up
      </Typography>
      <div>
        <TextField
          error={props.errors.email}
          helperText={props.errors.email && props.errors.email.message}
          autoFocus
          onChange={handleChange}
          fullWidth
          required
          type="email"
          id="email"
          value={formInputs.email}
          name="email"
          label="Email"
        />
      </div>
      <div>
        <TextField
          error={props.errors.username}
          helperText={props.errors.username && props.errors.username.message}
          onChange={handleChange}
          fullWidth
          required
          type="text"
          value={formInputs.username}
          name="username"
          label="Username"
        />
      </div>
      <div>
        <TextField
          error={props.errors.password}
          helperText={
            props.errors.password &&
            //mapPasswordReq is an util function which returns more detailed error messages about the password field based on the array which
            //the password-validator package returns
            mapPasswordReq(props.errors.password.message).map((error) => (
              <div>{error}</div>
            ))
          }
          onChange={handleChange}
          fullWidth
          required
          type="password"
          value={formInputs.password}
          name="password"
          label="Password"
        />
      </div>
      <div>
        <TextField
          error={props.errors.confirmPassword}
          helperText={props.errors.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
          type="password"
          value={formInputs.confirmPassword}
          name="confirmPassword"
          label="Confirm Password"
        />
      </div>
      <div>
        <TextField
          error={props.errors.age}
          helperText={props.errors.age && props.errors.age.message}
          onChange={handleChange}
          fullWidth
          type="number"
          value={formInputs.age}
          name="age"
          label="Age"
        />
      </div>
      <div>
        <TextField
          onChange={handleChange}
          fullWidth
          type="text"
          value={formInputs.location}
          name="location"
          label="Location"
        />
      </div>
      <div>
        <TextField
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          type="text"
          value={formInputs.about}
          name="about"
          label="About you"
        />
      </div>
      <div className={classes.signUpButton}>
        {props.isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={props.isLoading}
            onClick={handleSignUp}
            variant="contained"
            color="primary"
            size="large"
          >
            Sign up
          </Button>
        )}
      </div>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.errors,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signUp: (user) => dispatch(signUpUserAsync(user)),
  signUpFailure: (errors) => dispatch(signUpUserFailure(errors)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
