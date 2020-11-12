import * as actionTypes from "../actions/actionTypes";

const initialState = {
  userId: null,
  username: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  errors: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_USER_INIT:
      return { ...state, isLoading: true };
    case actionTypes.SIGNUP_USER_SUCCESS:
      return {
        ...state,
        userId: action.userId,
        username: action.username,
        token: action.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case actionTypes.SIGNUP_USER_FAILURE:
      return {
        ...state,
        errors: {
          email: action.errors.email,
          password: action.errors.password,
          confirmPassword: action.errors.confirmPassword,
          username: action.errors.username,
          age: action.errors.age,
        },
        isAuthenticated: false,
        isLoading: false,
      };
    case actionTypes.SIGNIN_USER_SUCCESS:
      return {
        ...state,
        userId: action.userId,
        username: action.username,
        token: action.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case actionTypes.SIGNIN_USER_FAILURE:
      return {
        ...state,
        errors: action.error,
        isLoading: false,
        isAuthenticated: false,
      };
    case actionTypes.SIGNOUT_USER_SUCCESS:
      return {
        ...state,
        token: null,
        userId: null,
        username: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case actionTypes.SIGNOUT_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: { ...action.error },
      };
    default:
      return state;
  }
};

export default authReducer;
