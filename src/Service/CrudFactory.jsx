import instance from "axios";
import { getToken, logout } from "./UserFactory";
import { notification } from "../Components/Utils/Utils";

// Base url
export const baseURL = "https://falcon-backend-48ya.onrender.com";

// Setup axios object
export const axios = instance.create({ baseURL: baseURL + "/api" });

// Generate Request Template
async function request(requestOptions) {
  const { url, data, method, notify = true, ...rest } = requestOptions;

  // Append base url
  let fullurl = url;

  // Set basic header
  let headers = { Accept: "*/*" };
  if (getToken()) headers["Authorization"] = `Bearer ${getToken()}`;

  // Get query params
  if (method === "GET") fullurl += `?${new URLSearchParams(data)}`;
  // Set content type
  else if (!(data instanceof FormData)) headers["Content-Type"] = "application/json";

  // Setup response template
  let res = { data: [], message: "", status: false };

  try {
    // Make request
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
    res.data = response.data.data;

    // Notify user
    if (method !== "GET" && notify) notification("api-toast", res.message, "success");
  } catch (e) {
    // If unauthorize then logout user
    if (e?.response?.status === 401) {
      logout();
      notification("api-toast", "Session expired!", "error");
    }

    // Setup Error response
    res.status = false;
    res.message = e?.response?.data?.error || "An error occured.";
    // Notify user
    if (notify) notification("api-toast", res.message, "error");
  }
  return res;
}

export async function get(url, data, requestOptions) {
  return request({ method: "GET", url, data, ...requestOptions });
}

export async function post(url, data, requestOptions) {
  return request({ method: "POST", url, data, ...requestOptions });
}

export async function put(url, data, requestOptions) {
  return request({ method: "PUT", url, data, ...requestOptions });
}

export async function patch(url, data, requestOptions) {
  return request({ method: "PATCH", url, data, ...requestOptions });
}

export async function deletes(url, data, requestOptions) {
  return request({ method: "DELETE", url, data, ...requestOptions });
}
