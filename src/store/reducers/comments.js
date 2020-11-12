import * as actionTypes from "../actions/actionTypes";

const initialState = {
  posts: [],
  isLoading: false,
  errors: {},
  success: false,
  closeForm: false,
};

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COMMENT_REQUEST_INIT:
      return {
        ...state,
        isLoading: true,
        errors: {},
      };
    case actionTypes.CLOSE_COMMENT_FORM_RESET:
      return {
        ...state,
        closeForm: false,
      };
    case actionTypes.GET_COMMENTS_SUCCESS:
      let newPosts = [...state.posts];
      const postIndex = state.posts.findIndex(
        (post) => post.id === action.postId
      );
      if (postIndex >= 0) {
        newPosts[postIndex].comments = action.comments;
      } else {
        newPosts.push({ id: action.postId, comments: action.comments });
      }
      return {
        ...state,
        isLoading: false,
        posts: newPosts,
      };
    case actionTypes.GET_COMMENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.error,
      };
    case actionTypes.CREATE_COMMENT_SUCCESS:
      const postsArr = [...state.posts];
      const postToUpdate = postsArr.find(
        (post) => post.id === action.comment.onPost
      );

      //This if is kind of unnecessary since the post is almost guaranteed to exist, but a little safety check can't hurt that much
      if (postToUpdate) {
        postToUpdate.comments.push(action.comment);
      }
      return {
        ...state,
        isLoading: false,
        posts: postsArr,
      };
    case actionTypes.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    case actionTypes.UPDATE_COMMENT_SUCCESS:
      const posts = [...state.posts];
      const postHasComment = posts.find((post) => post.id === action.postId);

      postHasComment.comments = postHasComment.comments.map((comment) =>
        comment._id === action.updatedComment._id
          ? action.updatedComment
          : comment
      );

      return {
        ...state,
        isLoading: false,
        closeForm: true,
        posts,
      };
    case actionTypes.UPDATE_COMMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.error,
      };
    case actionTypes.DELETE_COMMENT_SUCCESS:
      let postsArrCopy = [...state.posts];

      let postWithComment = postsArrCopy.find(
        (post) => post.id === action.postId
      );

      //Same as in the create comment if
      if (postWithComment) {
        postWithComment.comments = postWithComment.comments.filter(
          (comment) => comment._id !== action.commentId
        );
      }
      return {
        ...state,
        isLoading: false,
        posts: postsArrCopy,
      };
    default:
      return state;
  }
};

export default commentReducer;
