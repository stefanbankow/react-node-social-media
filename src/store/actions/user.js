import axios from "axios";
import * as actionTypes from "./actionTypes";

export const userRequestInit = () => {
  return {
    type: actionTypes.USER_REQUEST_INIT,
  };
};
export const closeFormReset = () => {
  return {
    type: actionTypes.CLOSE_USER_FORM_RESET,
  };
};

//Getting a user
export const getUserProfileInit = () => {
  return {
    type: actionTypes.GET_USER_PROFILE_INIT,
  };
};
export const getUserProfileSuccess = (user) => {
  return {
    type: actionTypes.GET_USER_PROFILE_SUCCESS,
    user,
  };
};

export const getUserProfileFailure = (errors) => {
  return {
    type: actionTypes.GET_USER_PROFILE_FAILURE,
    errors,
  };
};

export const getUserProfileAsync = (username) => {
  return (dispatch) => {
    dispatch(getUserProfileInit());
    axios
      .get(`/users/${username}`)
      .then((res) => {
        dispatch(getUserProfileSuccess(res.data.user));
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          getUserProfileFailure(
            error.response ? error.response.data.error : error
          )
        );
      });
  };
};

//Updating a user's about info

export const updateUserAboutSuccess = (updatedUser) => {
  return {
    type: actionTypes.UPDATE_USER_ABOUT_SUCCESS,
    updatedUser,
  };
};

export const updateUserAboutFailure = (errors) => {
  return {
    type: actionTypes.UPDATE_USER_ABOUT_FAILURE,
    errors,
  };
};

export const updateUserAboutAsync = (reqBody) => {
  return (dispatch) => {
    dispatch(userRequestInit());
    axios
      .patch("/users", reqBody)
      .then((res) => {
        dispatch(updateUserAboutSuccess(res.data.user));
        dispatch(closeFormReset());
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          updateUserAboutFailure(
            err.response ? err.response.data.error.errors : err
          )
        );
      });
  };
};

//Updating a user's password
export const updateUserPasswordSuccess = () => {
  return {
    type: actionTypes.UPDATE_USER_PASSWORD_SUCCESS,
  };
};
export const updateUserPasswordFailure = (errors) => {
  return {
    type: actionTypes.UPDATE_USER_PASSWORD_FAILURE,
    errors,
  };
};

export const updateUserPasswordAsync = (reqBody) => {
  return (dispatch) => {
    dispatch(userRequestInit());
    axios
      .patch("/users/change-password", reqBody)
      .then((res) => {
        dispatch(updateUserPasswordSuccess());
        dispatch(closeFormReset());
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          updateUserPasswordFailure(
            err.response ? err.response.data.error.errors : err
          )
        );
      });
  };
};
