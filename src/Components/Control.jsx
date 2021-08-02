import { TextField, withStyles } from "@material-ui/core";
import React, { useState } from "react";

// Apply styles for text fields
const styles = {
  root: {
    "& label": {
      textTransform: "capitalize",
    },
  },
};

// Get New text field with some default values
const TextControl = withStyles(styles)(
  ({ name, variant, label, value, error, onChange, ...others }) => (
    <TextField
      variant={variant || "filled"}
      name={name || "text"}
      value={value}
      onChange={onChange}
      label={label || name}
      {...(error && { error: true, helperText: error })}
      {...others}
    />
  )
);

// Use form function
function useForm(defaultValue, validateOnChange, validateInput) {
  // Set react hook, for values
  const [value, setValue] = useState(defaultValue);
  // Set react hook, for error
  const [error, setError] = useState({});

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update input
    setValue((val) => ({ ...val, [name]: value }));
    // Validate input
    if (validateOnChange) validateInput({ [name]: value.trim() });
  };

  // Reset form
  const resetForm = () => {
    setValue(defaultValue);
    setError({});
  };

  return { value, setValue, error, setError, handleInputChange, resetForm };
}

export { TextControl, useForm };
