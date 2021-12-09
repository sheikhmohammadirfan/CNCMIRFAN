import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import MomentUtils from "@date-io/moment";
import App from "./App.jsx";
import reducers from "./redux/reducers.js";
import { initGapi } from "./Service/GAPI.jsx";

initGapi();

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
