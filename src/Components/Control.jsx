import {
  Icon,
  IconButton,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  TextField,
  withStyles,
} from "@material-ui/core";
import React, { useState } from "react";

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
  },
})(
  ({
    name,
    variant,
    label,
    value,
    error,
    removeGutter = false,
    onChange,
    ...others
  }) => (
    <TextField
      variant={variant || "filled"}
      name={name || "text"}
      value={value}
      onChange={onChange}
      label={label || name}
      error={error !== "" && error !== undefined}
      helperText={error ? error : removeGutter ? "" : " "}
      {...others}
    />
  )
);

// Get Paassword field with show/hide password btn
const PasswordControl = ({ value, ...others }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextControl
      type={visible ? "text" : "password"}
      value={value}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              style={{
                visibility: value ? "visible" : "hidden",
                opacity: value ? "1" : "0",
                transition: "all .1s linear",
              }}
              onClick={() => setVisible((v) => !v)}
            >
              <Icon>{visible ? "visibility_off" : "visibility"}</Icon>
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...others}
    />
  );
};

// Get checkbox, with label
const CustomCheckbox = withStyles((theme) => ({
  root: { margin: 0 },
}))(FormControlLabel);
const CheckboxControl = ({
  color,
  name,
  label,
  value,
  onChange,
  ...others
}) => (
  <CustomCheckbox
    control={<Checkbox color={color || "default"} name={name} />}
    checked={value}
    onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
    label={label || name}
    {...others}
  />
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
    setValue((val) => ({
      ...val,
      // clean the input
      [name]: typeof value === "string" ? value.trim() : value,
    }));
    // Validate input
    if (validateOnChange) validateInput({ [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setValue(defaultValue);
    setError({});
  };

  return { value, setValue, error, setError, handleInputChange, resetForm };
}

export { TextControl, PasswordControl, CheckboxControl, useForm };
