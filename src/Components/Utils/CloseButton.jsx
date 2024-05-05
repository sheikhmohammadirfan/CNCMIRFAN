import { Icon, IconButton } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

/* Close button Component */
function CloseButton({ click, type = "contained", ...rest }) {
  return (
    <IconButton onClick={click} {...rest}>
      <Icon style={{color: '#0084477CE374'}}>{type === "text" ? "close" : "cancel"}</Icon>
    </IconButton>
  );
}
CloseButton.propTypes = {
  click: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["contained", "text"]),
};

export default CloseButton;
