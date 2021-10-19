import { combineReducers, createStore } from "redux";
import commentReducer from "./reducers/comment";
import notificationReducer from "./reducers/notifications";
import userReducer from "./reducers/user";
import videoReducer from "./reducers/video";

export const store = createStore(combineReducers({
  user: userReducer,
  video: videoReducer,
  comment: commentReducer,
  notification: notificationReducer
}));
