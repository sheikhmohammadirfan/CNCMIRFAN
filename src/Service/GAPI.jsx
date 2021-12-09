import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DISCOVERY_DOCS,
  GAPI_INIT_STATUS,
  GAPI_SCOPES,
} from "./GAPI_CREDS";
import { post } from "./CrudFactory";
import { setToken, setUser } from "./UserFactory";
import { toast } from "react-toastify";

export let GAPI_SETUP_STATUS = GAPI_INIT_STATUS.INCOMPLETE;
export let GAPI_SIGNIN_STATUS = false;

const gapi = window?.gapi;
let GAPI_AUTH = null;
export let GAPI_TOKEN = null;
export let GAPI_USER = null;

export function initGapi() {
  gapi.load("client:auth2", init);
  gapi.load("picker", initPicker);
}

export async function gapi_signin() {
  try {
    const res = await GAPI_AUTH.signIn();
    const token = res.getAuthResponse().id_token;
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

export function gapi_signout() {
  GAPI_AUTH.signOut();
}

function init() {
  gapi.client
    .init({
      apiKey: GAPI_API_KEY,
      clientId: GAPI_CLIENT_ID,
      discoveryDocs: GAPI_DISCOVERY_DOCS,
      scope: GAPI_SCOPES,
    })
    .then(onInitSuccessHandler, onInitFaliureHandler);
}

function onInitSuccessHandler() {
  // window.gapi = null;
  GAPI_SETUP_STATUS = GAPI_INIT_STATUS.SUCCESS;
  GAPI_AUTH = gapi.auth2.getAuthInstance();
  GAPI_AUTH.isSignedIn.listen(updateSigninStatus);
  updateSigninStatus(GAPI_AUTH.isSignedIn.get());
}

function onInitFaliureHandler(error) {
  // window.gapi = null;
  GAPI_SETUP_STATUS = GAPI_INIT_STATUS.FAILURE;
  console.error(error);
}

function updateSigninStatus(signin) {
  GAPI_SIGNIN_STATUS = signin;
  if (signin) setGapiToken();
  else unsetGapiToken();
}

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

function unsetGapiToken() {
  GAPI_TOKEN = null;
}

/**
 ******************************************************************
 */

let picker_loaded = false;
let GAPI_PICKER = null;
let PICKER = null;

function initPicker() {
  picker_loaded = true;
  PICKER = window.google?.picker;
  createPicker();
}

export function createPicker() {
  if (picker_loaded && GAPI_TOKEN) {
    const docsView = new PICKER.ViewGroup(
      new PICKER.DocsView(PICKER.ViewId.SPREADSHEETS).setLabel("PPT & DOC")
    )
      .addView(PICKER.ViewId.DOCUMENTS)
      .addView(PICKER.ViewId.PRESENTATIONS);
    GAPI_PICKER = new PICKER.PickerBuilder()
      .addViewGroup(docsView)
      .addView(
        new PICKER.DocsView(PICKER.ViewId.SPREADSHEETS).setLabel("Excel")
      )
      // .addView(new PICKER.DocsUploadView())
      .setOAuthToken(GAPI_TOKEN.access_token)
      .setDeveloperKey(GAPI_API_KEY)
      .setCallback(pickerCallback)
      .build();
  }
}

function pickerCallback(data) {
  var url = "nothing";
  if (data[PICKER.Response.ACTION] === PICKER.Action.PICKED) {
    var doc = data[PICKER.Response.DOCUMENTS][0];
    url = doc[PICKER.Document.URL];
  }
  console.log(url);
}

export function showPicker() {
  GAPI_PICKER.setVisible(true);
}

export function closePicker() {
  GAPI_PICKER.setVisible(false);
}
