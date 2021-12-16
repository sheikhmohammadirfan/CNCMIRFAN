import {
  Icon,
  IconButton,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  TextField,
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  Slider,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
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
    name = "text",
    variant = "filled",
    label,
    value,
    error = "",
    removeGutter = false,
    onChange,
    ...others
  }) => (
    <TextField
      variant={variant}
      name={name}
      value={value}
      onChange={onChange}
      label={label || name}
      error={error !== ""}
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
  color = "default",
  name,
  label,
  value,
  onChange,
  ...others
}) => (
  <CustomCheckbox
    control={<Checkbox color={color} name={name} />}
    checked={value}
    onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
    label={label || name}
    {...others}
  />
);

// Get dropdown input
const DropdownControl = ({
  name = "dropdown",
  variant = "default",
  label,
  value,
  error,
  onChange,
  options,
  selectProps,
  optionProps,
  ...others
}) => {
  if (!label) label = name;
  return (
    <FormControl variant={variant} {...others}>
      <InputLabel id={`${label.replaceAll(" ", "-")}-id`}>{label}</InputLabel>
      <Select
        labelId={`${label.replaceAll(" ", "-")}-id`}
        id={`${label.replaceAll(" ", "-")}`}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        {...selectProps}
      >
        {options[0]?.text
          ? options.map(({ text, val }, index) => (
              <MenuItem value={val} key={index} {...optionProps}>
                {text}
              </MenuItem>
            ))
          : options.map((val, index) => (
              <MenuItem value={val} key={index}>
                {val}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};

// Get Datepicker
const DatepickerControl = ({
  name = "date",
  label,
  value,
  onChange,
  icon = "calendar_today",
  iconPosition = "start",
  variant = "standard",
  ...other
}) => (
  <DatePicker
    label={label || name}
    variant={variant}
    inputVariant={variant}
    InputProps={{
      startAdornment: (
        <InputAdornment position={iconPosition}>
          <Icon>{icon}</Icon>
        </InputAdornment>
      ),
    }}
    name={name}
    value={value || null}
    onChange={(e) => onChange({ target: { name, value: e.toDate() } })}
    {...other}
  />
);

// Get radio
const RadioControl = ({
  name = "",
  value,
  direction = "",
  onChange,
  options,
  hideLabel = false,
  ...others
}) => (
  <FormControl {...others}>
    {!hideLabel && <FormLabel component="legend">{name}</FormLabel>}
    <RadioGroup
      row={direction === "row"}
      aria-label={name.replaceAll(" ", "-")}
      name={name}
      value={value}
      onChange={onChange}
    >
      {options[0]?.text
        ? options.map(({ text, val }, index) => (
            <FormControlLabel
              key={index}
              value={val}
              control={<Radio />}
              label={text}
            />
          ))
        : options.map((val, index) => (
            <FormControlLabel
              key={index}
              value={val}
              control={<Radio />}
              label={val}
            />
          ))}
    </RadioGroup>
  </FormControl>
);

// Get Slider input
const SliderControl = ({
  name,
  step = 1,
  markers = [],
  value,
  onChange,
  ...other
}) => {
  const mapLabelToValue = (l) => {
    const v = markers.find((mark) => mark.label == l);
    return v ? v.value : 0;
  };

  const mapValueToLabel = (v) => {
    const l = markers.find((mark) => mark.value == v);
    return l ? l.label : "";
  };

  return (
    <FormControl {...other}>
      <FormLabel component="legend">{name}</FormLabel>
      <Slider
        step={step}
        marks={markers}
        value={markers.length ? mapLabelToValue(value) : value}
        onChange={(_, val) =>
          onChange({
            target: {
              name,
              value: markers.length ? mapValueToLabel(val) : val,
            },
          })
        }
      />
    </FormControl>
  );
};

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
      [name]: value,
    }));
    // Validate input
    if (validateOnChange) validateInput({ [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setValue(defaultValue);
    setError();
  };

  return { value, setValue, error, setError, handleInputChange, resetForm };
}

export {
  TextControl,
  PasswordControl,
  CheckboxControl,
  DropdownControl,
  DatepickerControl,
  RadioControl,
  SliderControl,
  useForm,
};
