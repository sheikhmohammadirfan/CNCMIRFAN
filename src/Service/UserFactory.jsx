import { get, post } from "./CrudFactory";

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
async function login({ email, password }, options) {
  const { data, status } = await post(
    "/user/login",
    { email, password },
    options
  );
  if (status) {
    setToken(data.token);
    setUser(data.user);
  }
  return status;
}

// Signup user
async function signup({ name, email, password }, options) {
  const { status } = await post("/user", { name, email, password }, options);
  return status;
}

// Loginout user
async function logout(options) {
  const { status } = await get(`/user/logout/${getUser().id}`, options);
  deleteToken();
  deleteUser();
  return status;
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
