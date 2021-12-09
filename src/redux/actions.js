import { USER } from "./actionTypes";

export const saveUserAction = (user) => {
  return {
    type: USER.LOGIN,
    payload: user,
  };
};
