import axios from "axios";
import {toast, Flip} from "react-toastify";
import ErrMsg from "./ErrMsg";

/**
 * ------> MANAGE USER
 */

// Get User from storage
function getUser() {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
}

// Set User to Storage
function setUser(obj) {
  localStorage.setItem("user", JSON.stringify(obj));
}

// Delete User from Storage
function deleteUser() {
  localStorage.removeItem("user");
}

/**
 * ------> MANAGE TOKEN
 */

// Get User from storage
function getToken() {
  return localStorage.getItem("accessToken");
}

// Set User to Storage
function setToken(token) {
  localStorage.setItem("accessToken", token);
}

// Delete User from Storage
function deleteToken() {
  localStorage.removeItem("accessToken");
}

// Login user
function login({ email, password }) {
  return axios.post("https://internassign.herokuapp.com/api/user/login", {email, password}).then(res => {
    setToken(res.data.access);
    setUser(res.data.user);
      toast("Login Successfull.", {
        toastId: "api-toast",
        transition: Flip,
        type: "error",
      });
      return true;
  }).catch(e => {
      const msg = e.response?.data?.error || "An error occured.";
      toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
        toastId: "api-toast",
        transition: Flip,
        type: "error",
      });
      return false;
  });
}

// Signup user
function signup({ name, email, password }) {
  return axios.post("https://internassign.herokuapp.com/api/user", {name, email, password}).then(res => {
      toast("Signup Successfull.", {
        toastId: "api-toast",
        transition: Flip,
        type: "error",
      });
      return true;
  }).catch(e => {
      console.log(e.response.data);
      const msg =  "An error occured.";
      toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
        toastId: "api-toast",
        transition: Flip,   
        type: "error",
      });
      return false;
  });
}

// Logout user
function logout() {
  deleteToken();
  deleteUser();
}

export {
  getUser,
  setUser,
  deleteUser,
  getToken,
  setToken,
  deleteToken,
  login,
  signup,
  logout,
};
