import { Icon, IconButton, InputAdornment } from "@material-ui/core";
import { useState, forwardRef } from "react";
import TextControl from "./Text.control";
import PropTypes from "prop-types";
import { controlledName } from "../Utils";

// Get Paassword field with show/hide password btn
const PasswordControl = forwardRef(({ forceHidden, ...others }, ref) => {
  // Show to show/hide password state
  const [hidden, setHidden] = useState(true);

  return (
    <TextControl
      ref={ref}
      type={forceHidden || hidden ? "password" : "text"}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            style={{ display: forceHidden ? "none" : "flex" }}
          >
            <IconButton
              size="small"
              onClick={() => setHidden((v) => !v)}
              data-test="pasword-visibility-btn"
            >
              <Icon>{hidden ? "visibility" : "visibility_off"}</Icon>
            </IconButton>
          </InputAdornment>
        ),
      }}
      data-test="password-input"
      {...others}
    />
  );
});
PasswordControl.propTypes = {
  name: controlledName,
  controls: PropTypes.object,
};

export default PasswordControl;
