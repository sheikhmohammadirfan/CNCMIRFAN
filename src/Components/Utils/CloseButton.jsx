import { Icon, IconButton } from "@material-ui/core";
import React from "react";

function CloseButton({ click, type = "contained", ...rest }) {
  return (
    <IconButton onClick={click} {...rest}>
      <Icon>{type === "text" ? "close" : "cancel"}</Icon>
    </IconButton>
  );
}

export default CloseButton;
