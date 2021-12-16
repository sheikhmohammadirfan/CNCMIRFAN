import { post } from "./CrudFactory";

// Get User from storage
function getUser() {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
}

// Set User to Storage
function setUser(userObj) {
  localStorage.setItem("user", JSON.stringify(userObj));
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
async function login(details) {
  const { data, status } = await post("/user/login", details);

  // if success then set token
  if (status) {
    setToken(data.access);
    setUser(data.user);
  }

  return status;
}

// Signup user
async function signup(details) {
  const { status } = await post("/user", details);
  return status;
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
