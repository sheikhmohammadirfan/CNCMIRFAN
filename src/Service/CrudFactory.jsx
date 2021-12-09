import instance from "axios";
import { toast } from "react-toastify";
import ErrMsg from "./ErrMsg";
import { getToken, logout } from "./UserFactory";

// Base url
// const baseURL = "http://127.0.0.1:8000";
const baseURL = "https://internassign.herokuapp.com";

// Setup axios object
const axios = instance.create({ baseURL: baseURL + "/api" });

// Generate toast template
const notification = (msg, type) =>
  toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
    toastId: "api-toast",
    type,
  });

// Generate Request Template
async function request(requestOptions) {
  const { url, data, method, notify = true, ...rest } = requestOptions;

  // Append base url
  let fullurl = url;

  // Set basic header
  let headers = { Accept: "*/*" };
  if (getToken()) headers["Authorization"] = `Bearer ${getToken()}`;

  // Get query params
  if (method === "GET") {
    let queryString = new URLSearchParams(data);
    fullurl += `?${queryString}`;
  }
  // Set content type
  else if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Setup response template
  let res = { data: [], message: "", status: false };

  try {
    // Make request
    console.log(method, fullurl, data, headers);
    const response = await axios({
      method,
      url: fullurl,
      data,
      headers,
      ...rest,
    });
    // Setup Success response
    res.status = true;
    res.message = response.data.message;
    delete response.data.message;
    res.data = response.data;
    // Notify user
    if (method !== "GET" && notify) notification(res.message, "success");
  } catch (e) {
    // If unauthorize then logout user
    if (e?.response?.status === 401) logout();

    // Setup Error response
    res.status = false;
    res.message = e?.response?.data?.error || "An error occured.";
    // Notify user
    notification(res.message, "error");
  }
  return res;
}

async function get(url, data, requestOptions) {
  return request({ method: "GET", url, data, ...requestOptions });
}

async function post(url, data, requestOptions) {
  return request({ method: "POST", url, data, ...requestOptions });
}

async function put(url, data, requestOptions) {
  return request({ method: "PUT", url, data, ...requestOptions });
}

async function patch(url, data, requestOptions) {
  return request({ method: "PATCH", url, data, ...requestOptions });
}

async function deletes(url, data, requestOptions) {
  return request({ method: "DELETE", url, data, ...requestOptions });
}

export { baseURL, axios, get, post, put, patch, deletes };
