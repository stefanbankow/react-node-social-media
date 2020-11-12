import axios from "axios";
import * as actionTypes from "./actionTypes";

export const commentRequestInit = () => {
  return {
    type: actionTypes.COMMENT_REQUEST_INIT,
  };
};

export const closeFormReset = () => {
  return {
    type: actionTypes.CLOSE_COMMENT_FORM_RESET,
  };
};

//Getting comments
export const getCommentsSuccess = (response) => {
  return {
    type: actionTypes.GET_COMMENTS_SUCCESS,
    postId: response.onPost,
    comments: response.comments,
  };
};

export const getCommentsFailure = (errors) => {
  return {
    type: actionTypes.GET_COMMENTS_FAILURE,
    errors,
  };
};

export const getCommentsAsync = (postId) => {
  return (dispatch) => {
    dispatch(commentRequestInit());
    axios
      .get(`/posts/${postId}/comments`)
      .then((res) => {
        dispatch(getCommentsSuccess(res.data));
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          getCommentsFailure(err.response ? err.response.data : err.message)
        );
      });
  };
};

//Adding a comment
export const createCommentSuccess = (response) => {
  return {
    type: actionTypes.CREATE_COMMENT_SUCCESS,
    comment: response.comment,
  };
};

export const createCommentFailure = (errors) => {
  return {
    type: actionTypes.CREATE_COMMENT_FAILURE,
    errors,
  };
};

export const createCommentAsync = (postId, commentBody) => {
  return (dispatch) => {
    const commentObj = {
      content: commentBody,
    };
    dispatch(commentRequestInit());
    axios
      .post(`/posts/${postId}/comments`, commentObj)
      .then((res) => {
        dispatch(createCommentSuccess(res.data));
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          dispatch(createCommentFailure(err.response.data.error.errors));
        } else {
          dispatch(createCommentFailure(err.message));
        }
      });
  };
};

//Update a comment
export const updateCommentSuccess = (postId, updatedComment) => {
  return {
    type: actionTypes.UPDATE_COMMENT_SUCCESS,
    postId,
    updatedComment,
  };
};

export const updateCommentFailure = (error) => {
  return {
    type: actionTypes.UPDATE_COMMENT_FAILURE,
    error,
  };
};

export const updateCommentAsync = (postId, commentId, commentData) => {
  return (dispatch) => {
    dispatch(commentRequestInit());
    axios
      .patch(`/posts/${postId}/comments/${commentId}`, commentData)
      .then((res) => {
        dispatch(updateCommentSuccess(postId, res.data.updatedComment));
      })
      .catch((err) => {
        dispatch(
          updateCommentFailure(err.response ? err.response.data : err.message)
        );
      });
  };
};

//Delete a comment
export const deleteCommentSuccess = (postId, commentId) => {
  return {
    type: actionTypes.DELETE_COMMENT_SUCCESS,
    postId,
    commentId,
  };
};

export const deleteCommentFailure = (error) => {
  return {
    type: actionTypes.DELETE_COMMENT_FAILURE,
    error,
  };
};

export const deleteCommentAsync = (postId, commentId) => {
  return (dispatch) => {
    dispatch(commentRequestInit());
    axios
      .delete(`/posts/${postId}/comments/${commentId}`)
      .then(() => {
        dispatch(deleteCommentSuccess(postId, commentId));
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          deleteCommentFailure(err.response ? err.response.data : err.mesage)
        );
      });
  };
};
