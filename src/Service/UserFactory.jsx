import { notification } from "../Components/Utils/Utils";
import { patch, post } from "./CrudFactory";

/************ TOKEN *************/
// Get User from storage
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Set User to Storage
export function setToken(token) {
  localStorage.setItem("accessToken", token);
}

// Delete User from Storage
function deleteToken() {
  localStorage.removeItem("accessToken");
}

/************ USER *************/
// Get User from storage
export function getUser() {
  const user = localStorage.getItem("user");
  console.log(user);
  if (user) return JSON.parse(user);
  return null;
}

// Set User to Storage
// export function setUser(userObj) {
//   localStorage.setItem("user", JSON.stringify(userObj));
// }

// set User modified to dispatch event on user update by irfan
export function setUser(userObj) {
  localStorage.setItem("user", JSON.stringify(userObj));
  // Dispatch custom event to notify components about user change
  window.dispatchEvent(new CustomEvent('userUpdated', { detail: userObj }));
}

// Delete User from Storage
function deleteUser() {
  localStorage.removeItem("user");
}

/************ INTEGRATION PLATFORM *************/
// Get integrated plarform status
export function getIntegratedPlatform() {
  const items = localStorage.getItem("integration");
  if (items) return JSON.parse(items);
  return null;
}

// Set integrated plarform status
export function setIntegratedPlatform(obj) {
  localStorage.setItem("integration", JSON.stringify(obj));
}

// Delete User from Storage
function deleteIntegratedPlatform() {
  localStorage.removeItem("integration");
}

/************ ROUTING *************/
// Login user
export async function login(details) {
  const { data, status } = await post("/user/login", details, {
    
    isUserAPI: true,
  });

  // if success then set token
  if (status) {
    setToken(data.access);
    setUser(data.user);
    setIntegratedPlatform(data.integration);
  }

  return status;
}

// Signup user
export async function signup(details) {
  const { status } = await post("/user", details, {
    isUserAPI: true,
  });
  return status;
}

// Logout user
export function logout() {
  deleteToken();
  deleteUser();
  deleteIntegratedPlatform();
  // window.location.replace("/login");

  // added by irfan to notify all components about user logout
  window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));
  window.location.replace("/login");
}

// Update user details
export async function updateProfile(formData) {
  // Object save new data only
  const newData = {};
  // Get exsisting data, to check what has changed
  const prevData = getUser();

  // Convert date of birth to given format
  if (formData.date_of_birth)
    formData.date_of_birth = formData.date_of_birth?.format("YYYY-MM-DD");

  // Loop and get all updated data while skipping email & password field
  for (let key of Object.keys(formData))
    if (
      !["email", "New Password", "Confirm New Password"].includes(key) &&
      formData[key] !== prevData[key]
    )
      newData[key] = formData[key];

  // Check if password is changed
  if (formData["New Password"] !== "")
    newData["password"] = formData["New Password"];

  // Check if any data is change, then only send update request
  if (Object.keys(newData).length > 0)
    return await patch(`/user/update/`, newData, { isUserAPI: true });

  // Else return false value
  notification(
    "profile-toast",
    "Please Edit fields before submitting...",
    "error"
  );
  return { data: null, status: false };
}

export async function checkPasswordReset(data) {
  const { status } = await post("/user/reset-token-check/", data, {
    notify: false,
    isUserAPI: true,
  });
  if (!status)
    notification(
      "login-id",
      "Link is invalid or expired, please generate new one...",
      "error"
    );
  return status;
}

export async function requestPasswordReset(email) {
  const { status } = await post("/user/request-password-reset/", email, {
    isUserAPI: true,
  });
  return status;
}

export async function resetPassword(data) {
  const { status } = await patch("/user/password-reset/", data, {
    isUserAPI: true,
  });
  return status;
}
