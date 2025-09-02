import React from "react";
import { Route, useHistory } from "react-router-dom";
import { getToken } from "../../../Service/UserFactory";

/* Protected route wrapper, to check for authentication status */
function ProtectedRoutes(props) {
  const history = useHistory();

  return (
    <Route path="/">
      {getToken() ? props.children : history.replace("/login")}
    </Route>
  );
}

export default ProtectedRoutes;
