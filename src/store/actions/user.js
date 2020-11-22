import axios from "axios";
import * as actionTypes from "./actionTypes";
import { getPostsSuccess } from "./posts";

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
        //Setting the "posts" state as the posts of the user as to update them properly
        dispatch(getPostsSuccess(res.data.user.posts, res.data.user.postCount));
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

//Changing a profile picture
export const chngProfPicSuccess = (imgBinary) => {
  return {
    type: actionTypes.CHANGE_PROFILE_PICTURE_SUCCESS,
    imgBinary,
  };
};

export const chngProfPicFailure = (errors) => {
  return {
    type: actionTypes.CHANGE_PROFILE_PICTURE_FAILURE,
    errors,
  };
};

export const changeProfilePictureAsync = (file) => {
  return (dispatch) => {
    dispatch(userRequestInit());
    const formData = new FormData();
    formData.append("avatar", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post("/users/profile_pic", formData, config)
      .then((res) => {
        dispatch(chngProfPicSuccess(res.data.avatar));
        dispatch(closeFormReset());
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          chngProfPicFailure(error.response ? error.response.data : error)
        );
      });
  };
};
