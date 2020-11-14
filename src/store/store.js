import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import postReducer from "./reducers/posts";
import authReducer from "./reducers/auth";
import thunk from "redux-thunk";
import userReducer from "./reducers/user";
import commentReducer from "./reducers/comments";
import draftsReducer from "./reducers/drafts";

const rootReducer = combineReducers({
  posts: postReducer,
  drafts: draftsReducer,
  auth: authReducer,
  user: userReducer,
  comments: commentReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reduxStore = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
