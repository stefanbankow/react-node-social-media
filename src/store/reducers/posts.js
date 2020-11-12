import * as actionTypes from "../actions/actionTypes";
import clone from "rfdc";

const initialState = {
  posts: null,
  errors: {},
  isLoading: false,
  closeForm: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_REQUEST_INIT:
      return {
        ...state,
        isLoading: true,
        closeForm: false,
        errors: {},
      };
    case actionTypes.CLOSE_POST_FORM_RESET:
      return {
        ...state,
        closeForm: false,
      };

    case actionTypes.GET_POSTS:
      return {
        ...state,
        posts: action.posts,
      };

    case actionTypes.CREATE_POST_SUCCESS:
      return action.post.public
        ? {
            ...state,
            posts: [action.post, ...state.posts],
            errors: {},
            isLoading: false,
            closeForm: true,
          }
        : {
            ...state,
            errors: {},
            isLoading: false,
            closeForm: true,
          };
    case actionTypes.CREATE_POST_FAILURE:
      return {
        ...state,
        errors: { ...action.errors },
        isLoading: false,
      };

    case actionTypes.UPDATE_POST_SUCCESS:
      const newPosts = state.posts.map((post) =>
        action.post.id === post.id ? action.post : post
      );
      console.log(action.post);
      console.log(newPosts);
      return {
        ...state,
        posts: newPosts,
        isLoading: false,
        closeForm: true,
      };
    case actionTypes.UPDATE_POST_FAILURE:
      return {
        ...state,
        errors: { ...action.errors },
        isLoading: false,
      };

    case actionTypes.DELETE_POST_SUCCESS:
      const filteredPosts = state.posts.filter(
        (post) => post._id !== action.deletedPostId
      );
      return {
        ...state,
        posts: filteredPosts,
        isLoading: false,
      };
    case actionTypes.DELETE_POST_FAILURE:
      return {
        ...state,
        errors: action.errors,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default postReducer;