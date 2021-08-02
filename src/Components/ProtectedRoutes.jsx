import React from "react";
import { Route, useHistory } from "react-router-dom";

function ProtectedRoutes(props) {
  const history = useHistory();

  return (
    <Route path="/">
      {localStorage.getItem("accessToken")
        ? props.children
        : history.push("/login")}
    </Route>
  );
}

export default ProtectedRoutes;
