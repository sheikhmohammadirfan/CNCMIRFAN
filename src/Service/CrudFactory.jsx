import axios from "axios";
import { Flip, toast } from "react-toastify";
import ErrMsg from "./ErrMsg";
import { getToken } from "./UserFactory";

// Base API URL
const baseUrl = "https://internassign.herokuapp.com/api";

// Generate toast template
const notification = (msg, type) =>
  toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
    toastId: "api-toast",
    transition: Flip,
    type,
  });

// Generate Request Template
async function request(requestOptions) {
  const { url, data, method, notify = true } = requestOptions;

  // Append base url
  let fullurl = baseUrl + url;

  // Set basic header
  let headers = { Accept: "*/*", Authorization: `Bearer ${getToken()}` };

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
    const response = await axios({ method, url: fullurl, data });
    console.log(response);
    // Setup Success response
    res.status = true;
    // res.message = response.data.message;
    // delete response.data.message;
    res.data = response.data;
    // // Notify user
    // if (method !== "GET" && notify) notification(res.message, "success");
  } catch (e) {
    console.log(e.response);
    // Setup Error response
    res.status = false;
    // res.message = e?.response?.data?.error || "An error occured.";
    // // Notify user
    // notification(res.message, "error");
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

export { get, post, put, patch, deletes };
