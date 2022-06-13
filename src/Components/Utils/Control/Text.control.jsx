import { TextField, withStyles } from "@material-ui/core";
import { controlledName } from "../Utils";
import { getError, getLabel } from "./Controls.utils.js";
import { Field } from "./Form";
import PropTypes from "prop-types";

// Get New text field with some default values
const TextControl = withStyles({
  root: {
    // Capitalize label text
    "& label": { textTransform: "capitalize" },
    // Disable cursor on error text
    "& .MuiFormHelperText-root": {
      caretColor: "transparent",
      cursor: "default",
    },
    // If input type is password the show & hide button
    "& input[type=password][value=''] + div > button": {
      visibility: "hidden",
      opacity: 0,
      transition: "all .1s linear",
    },
  },
})((props) => (
  <Field
    {...props}
    field={({
      name,
      label,
      variant = "filled",
      error = "",
      gutter = true,
      controls,
      ...others
    }) => (
      <TextField
        variant={variant}
        name={name}
        label={getLabel(label, name)}
        error={Boolean(error || controls?.fieldState.error)}
        helperText={getError(error, controls?.fieldState.error, gutter)}
        {...controls?.field}
        {...others}
      />
    )}
  />
));
TextControl.propTypes = {
  name: controlledName,
  controls: PropTypes.object,
};

export default TextControl;
