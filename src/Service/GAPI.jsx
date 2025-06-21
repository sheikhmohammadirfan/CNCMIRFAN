import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DISCOVERY_DOCS,
  GAPI_SCOPES,
} from "../GAPI_CREDS";
import { post } from "./CrudFactory";
import { setToken, setUser } from "./UserFactory";
import { toast } from "react-toastify";
import { STATUS } from "../assets/data/Other";

// Gapi status variables
export let GAPI_SETUP_STATUS = STATUS.INCOMPLETE;
export let GAPI_SIGNIN_STATUS = false;

// Gapi global variables
const gapi = window.gapi;
let GAPI_AUTH = null;
export let GAPI_TOKEN = null;
export let GAPI_USER = null;

/* Method to set/unset gapi token on log-in/log-out */
function updateSigninStatus(signin) {
  GAPI_SIGNIN_STATUS = signin;
  if (signin) setGapiToken();
  else unsetGapiToken();
}

/* Method to set GAPI TOKEN */
async function setGapiToken() {
  GAPI_TOKEN = gapi.auth.getToken();
  GAPI_USER = GAPI_AUTH.currentUser.get().getBasicProfile();
  // console.log(GAPI_TOKEN);
  // console.log(GAPI_USER);
  createPicker();
  // if (GAPI_REFRESH_TOKEN) {
  //   const { data, status } = await post("/user/gdrive", {
  //     gdrive_accesstoken: GAPI_TOKEN.access_token,
  //     gdrive_refreshtoken: GAPI_REFRESH_TOKEN,
  //     gdrive_expiry_time: new Date(GAPI_TOKEN.expires_at).toISOString(),
  //   });
  //   console.log(data, status);
  // }
}

/* Method to load gapi client modules, & trigger callback */
export function initGapi() {
  // Load Oauth2 module
  gapi.load("client:auth2", init_auth_callback);

  // Load Drive Picker module
  gapi.load("picker", init_picker_callback);
}

/*********************
 * Oauth Section
 */

/* Oauth module Callback */
function init_auth_callback() {
  // Pass Application credentials
  gapi.client
    .init({
      apiKey: GAPI_API_KEY,
      clientId: GAPI_CLIENT_ID,
      discoveryDocs: GAPI_DISCOVERY_DOCS,
      scope: GAPI_SCOPES,
    })
    .then(auth_success_callback, auth_failure_callback);
}

/* Gapi object setup success callback */
function auth_success_callback() {
  window.gapi = null;

  GAPI_SETUP_STATUS = STATUS.SUCCESS;

  GAPI_AUTH = gapi.auth2.getAuthInstance();
  GAPI_AUTH.isSignedIn.listen(updateSigninStatus);

  updateSigninStatus(GAPI_AUTH.isSignedIn.get());
}

/* Gapi object setup failure callback */
function auth_failure_callback(error) {
  // Remove gapi obj from window
  window.gapi = null;

  GAPI_SETUP_STATUS = STATUS.FAILURE;
  console.error(error);
}

/* Prompt google signin */
export async function gapi_signin() {
  try {
    // Show signin prompt
    const res = await GAPI_AUTH.signIn();

    // Extract token
    const token = res.getAuthResponse().id_token;

    // Put token in database, and wait to login response
    const { data, status } = await post("/user/provider/google/", {
      auth_token: token,
    });
    setToken(data?.tokens.access);
    setUser(data?.email);
    toast("Login Successfull.", {
      toastId: "api-toast",
      type: "error",
    });
    return status;
  } catch (e) {
    console.log(e);
    return false;
  }
}

/* Signout user */
export function gapi_signout() {
  GAPI_AUTH.signOut();
}

/* Method to unset GAPI TOKEN */
function unsetGapiToken() {
  GAPI_TOKEN = null;
}

/**
 ******************************************************************
 */
/* DRIVE PICKER STATUS */
let picker_loaded = false;
let GAPI_PICKER = null;
let PICKER = null;

/* After drive picker api is loaded, then create picker obj */
function init_picker_callback() {
  picker_loaded = true;
  PICKER = window.google?.picker;
  createPicker();
}

/* Method to execute after file is selected or dialog is closed */
function pickerCallback(data) {
  var url = "nothing";
  if (data[PICKER.Response.ACTION] === PICKER.Action.PICKED) {
    var doc = data[PICKER.Response.DOCUMENTS][0];
    url = doc[PICKER.Document.URL];
  }
  console.log(url);
}

/* Method to google picker object */
export function createPicker() {
  // Check if picker api is loaded, & user is logged in
  if (picker_loaded && GAPI_TOKEN) {
    const viewGroup = new PICKER.ViewGroup(
      new PICKER.DocsView(PICKER.ViewId.SPREADSHEETS).setLabel("PPT & DOC"),
    )
      .addView(PICKER.ViewId.DOCUMENTS)
      .addView(PICKER.ViewId.PRESENTATIONS);

    const view = new PICKER.DocsView(PICKER.ViewId.SPREADSHEETS).setLabel(
      "Excel",
    );

    // Set picker object
    GAPI_PICKER = new PICKER.PickerBuilder()
      .addViewGroup(viewGroup)
      .addView(view)
      .setOAuthToken(GAPI_TOKEN.access_token)
      .setDeveloperKey(GAPI_API_KEY)
      .setCallback(pickerCallback)
      .build();
  }
}

// Method to toggle visibility of drive picker
export function showPicker() {
  GAPI_PICKER.setVisible(true);
}
export function closePicker() {
  GAPI_PICKER.setVisible(false);
}
