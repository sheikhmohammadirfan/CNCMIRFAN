import React from "react";
import { Route, useHistory } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const history = useHistory();

  return (
    <Route path="/">
      {localStorage.getItem("accessToken") ? children : history.push("/login")}
    </Route>
  );
}

export default ProtectedRoutes;
