import { USER } from "./actionTypes";
import { combineReducers } from "redux";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case USER.LOGIN:
      return action.payload;

    case USER.LOGOUT:
      return null;

    default:
      return state;
  }
};

const reducers = combineReducers({
  userReducer,
});
export default reducers;
