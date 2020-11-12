import * as actionTypes from "../actions/actionTypes";

const initState = {
  user: null,
  isLoading: false,
  errors: {},
  closeForm: false,
};

const userReducers = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.USER_REQUEST_INIT:
      return { ...state, isLoading: true, errors: {} };
    case actionTypes.CLOSE_USER_FORM_RESET:
      return {
        ...state,
        closeForm: false,
      };
    //Getting user data
    case actionTypes.GET_USER_PROFILE_INIT:
      return { ...state, user: null, isLoading: true, errors: {} };
    case actionTypes.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.user,
        isLoading: false,
      };
    case actionTypes.GET_USER_PROFILE_FAILURE:
      return { ...state, errors: action.errors, user: null, isLoading: true };
    //Updating user about info
    case actionTypes.UPDATE_USER_ABOUT_SUCCESS:
      const userCopy = { ...state.user };

      userCopy.age = action.updatedUser.age;
      userCopy.location = action.updatedUser.location;
      userCopy.about = action.updatedUser.about;
      userCopy.posts = [...state.user.posts];

      return {
        ...state,
        user: userCopy,
        isLoading: false,
        closeForm: true,
      };
    case actionTypes.UPDATE_USER_ABOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    case actionTypes.UPDATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        closeForm: true,
      };
    case actionTypes.UPDATE_USER_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };

    default:
      return state;
  }
};

export default userReducers;
