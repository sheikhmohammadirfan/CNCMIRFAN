import { axios } from "./CrudFactory";
import { toast } from "react-toastify";
import ErrMsg from "./ErrMsg";

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
async function login({ email, password }) {
  try {
    const res = await axios.post("/user/login", {
      email,
      password,
    });
    setToken(res.data.access);
    setUser(res.data.user);
    toast("Login Successfull.", {
      toastId: "api-toast",
      type: "error",
    });
    return true;
  } catch (e) {
    const msg = e.response?.data?.error || "An error occured.";
    toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
      toastId: "api-toast",
      type: "error",
    });
    return false;
  }
}

// Signup user
async function signup({ name, email, password }) {
  try {
    await axios.post("https://internassign.herokuapp.com/api/user", {
      name,
      email,
      password,
    });
    toast("Signup Successfull.", {
      toastId: "api-toast",
      type: "error",
    });
    return true;
  } catch (e) {
    console.log(e.response.data);
    const msg = "An error occured.";
    toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
      toastId: "api-toast",
      type: "error",
    });
    return false;
  }
}

// Logout user
function logout() {
  deleteToken();
  deleteUser();
  window.location.href = "/login";
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
