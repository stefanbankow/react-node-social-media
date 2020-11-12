import * as actionTypes from "./actionTypes";
import axios from "axios";
import mapSignUpErrors from "../../util/mapSignUpErrors";

//Used to set loading to true
export const authUserInit = () => {
  return {
    type: actionTypes.AUTH_USER_INIT,
  };
};

export const checkAuthAsync = () => {
  return (dispatch) => {
    dispatch(authUserInit);
    axios
      .get("/users/auth")
      .then((res) => {
        dispatch(
          signInUserSuccess(res.data.token, res.data.userId, res.data.username)
        );
      })
      .catch((err) => {});
  };
};

//Sign up actions
export const signUpUserSuccess = (userId, username, token) => {
  return {
    type: actionTypes.SIGNUP_USER_SUCCESS,
    userId,
    username,
    token,
  };
};

export const signUpUserFailure = (errors) => {
  return {
    type: actionTypes.SIGNUP_USER_FAILURE,
    errors,
  };
};

export const signUpUserAsync = (user) => {
  return (dispatch) => {
    dispatch(authUserInit());
    axios
      .post("/users", user)
      .then((res) => {
        dispatch(
          signUpUserSuccess(
            res.data.userId,
            res.data.newUser.username,
            res.data.token
          )
        );
      })
      .catch((err) => {
        console.error(err.response.data.error.errors);
        dispatch(
          signUpUserFailure(err.response && err.response.data.error.errors)
        );
      });
  };
};

//Sign in actions

export const signInUserSuccess = (token, userId, username) => {
  return {
    type: actionTypes.SIGNIN_USER_SUCCESS,
    token,
    userId,
    username,
  };
};

export const signInUserFailure = (error) => {
  return {
    type: actionTypes.SIGNIN_USER_FAILURE,
    error,
  };
};

export const signInUserAsync = (email, password) => {
  return (dispatch) => {
    dispatch(authUserInit());
    axios
      .post("/users/login", { email, password }, { withCredentials: true })
      .then((res) => {
        dispatch(
          signInUserSuccess(res.data.token, res.data.userId, res.data.username)
        );
      })
      .catch((error) => {
        console.error(error);
        dispatch(signInUserFailure(error.response.data));
      });
  };
};

//Signing out
export const signOutUserSuccess = () => {
  return {
    type: actionTypes.SIGNOUT_USER_SUCCESS,
  };
};

export const signOutUserFailure = (error) => {
  return {
    type: actionTypes.SIGNOUT_USER_FAILURE,
    error,
  };
};

export const signOutUserAsync = () => {
  return (dispatch) => {
    dispatch(authUserInit());
    axios
      .get("/users/logout", {})
      .then((res) => {
        dispatch(signOutUserSuccess());
      })
      .catch((error) => {
        console.error(error.response.data.error);
        //dispatch(signOutUserFailure(error.response.data.error));
      });
  };
};
