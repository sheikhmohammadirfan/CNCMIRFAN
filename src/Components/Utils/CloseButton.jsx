import { Icon, IconButton } from "@material-ui/core";
import React from "react";

/* Close button Component */
export default function CloseButton({ click, type = "contained", ...rest }) {
  return (
    <IconButton onClick={click} {...rest}>
      <Icon>{type === "text" ? "close" : "cancel"}</Icon>
    </IconButton>
  );
}
