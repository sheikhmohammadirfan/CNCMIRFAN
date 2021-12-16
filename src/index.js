import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import ReactDOM from "react-dom";
import MomentUtils from "@date-io/moment";
import App from "./App.jsx";
import { initGapi } from "./Service/GAPI.jsx";
import "./style.css";

// Load gapi client modules
initGapi();

ReactDOM.render(
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <App />
  </MuiPickersUtilsProvider>,
  document.getElementById("root")
);
