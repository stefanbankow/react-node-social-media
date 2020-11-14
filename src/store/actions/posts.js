import * as actionTypes from "./actionTypes";
import axios from "axios";

export const initPostRequest = () => {
  return {
    type: actionTypes.POST_REQUEST_INIT,
  };
};

export const closeFormReset = () => {
  return {
    type: actionTypes.CLOSE_POST_FORM_RESET,
  };
};

//Getting posts
export const getPostsSuccess = (posts) => {
  return {
    type: actionTypes.GET_POSTS,
    posts,
  };
};

export const getPostsAsync = () => {
  return (dispatch) => {
    axios
      .get("/posts")
      .then((resData) => {
        dispatch(getPostsSuccess(resData.data.posts));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

//Creating posts
export const createPostSuccess = (post) => {
  return {
    type: actionTypes.CREATE_POST_SUCCESS,
    post,
  };
};

export const createPostFailure = (errors) => {
  return {
    type: actionTypes.CREATE_POST_FAILURE,
    errors,
  };
};

export const createPostAsync = (postData) => {
  return (dispatch) => {
    dispatch(initPostRequest());
    axios
      .post("/posts", { ...postData, public: true })
      .then((res) => {
        dispatch(createPostSuccess(res.data));
        dispatch(closeFormReset());
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          createPostFailure(
            error.response ? error.response.data.error.errors : error.message
          )
        );
      });
  };
};

//Updating Posts
export const updatePostSuccess = (post) => {
  return {
    type: actionTypes.UPDATE_POST_SUCCESS,
    post,
  };
};

export const updatePostFailure = (errors) => {
  return {
    type: actionTypes.UPDATE_POST_FAILURE,
    errors,
  };
};

export const updatePostAsync = (postId, postData) => {
  return (dispatch) => {
    dispatch(initPostRequest());
    axios
      .patch(`/posts/${postId}`, postData)
      .then((res) => {
        dispatch(updatePostSuccess(res.data.updatedPost));
        dispatch(closeFormReset());
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          updatePostFailure(err.response ? err.response.data : err.message)
        );
      });
  };
};

//Deleting posts
export const deletePostSuccess = (deletedPostId) => {
  return {
    type: actionTypes.DELETE_POST_SUCCESS,
    deletedPostId,
  };
};

export const deletePostFailure = (errors) => {
  return {
    type: actionTypes.DELETE_POST_FAILURE,
    errors,
  };
};

export const deletePostAsync = (postId) => {
  return (dispatch) => {
    dispatch(initPostRequest());
    axios
      .delete(`/posts/${postId}`)
      .then((res) => {
        dispatch(deletePostSuccess(postId));
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          deletePostFailure(err.response ? err.response.data : err.message)
        );
      });
  };
};
