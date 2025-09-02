import React from "react";
import useParams from "../Hooks/useParams";

/* Query params wrapper, to mount/unmount component on basis of query parameter */
export default function ParamsRoutes({ params, removeParams, children }) {
  const { params: queryParams, deleteParams } = useParams(...params);

  const handleClose = () =>
    deleteParams(...(removeParams ? removeParams : params));

  return params.every((val) =>
    typeof val === "string"
      ? Boolean(queryParams[val])
      : queryParams[val] === params[val]
  )
    ? React.cloneElement(children, { close: handleClose, queryParams })
    : null;
}
