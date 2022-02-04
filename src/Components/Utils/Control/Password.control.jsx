import { Icon, IconButton, InputAdornment } from "@material-ui/core";
import { useState } from "react";
import TextControl from "./Text.control";

// Get Paassword field with show/hide password btn
export default function PasswordControl({ forceHidden, ...others }) {
  // Show to show/hide password state
  const [hidden, setHidden] = useState(true);

  return (
    <TextControl
      type={forceHidden || hidden ? "password" : "text"}
      InputProps={
        forceHidden
          ? {}
          : {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setHidden((v) => !v)}>
                    <Icon>{hidden ? "visibility" : "visibility_off"}</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }
      }
      {...others}
    />
  );
}
