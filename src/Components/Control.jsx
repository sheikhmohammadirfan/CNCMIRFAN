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
import React, { useContext, useState } from "react";
import { Controller } from "react-hook-form";

// Create controller context
const ControllerContext = React.createContext({
  control: null,
  rules: {},
  controlProps: {},
});

// Form compoenent to provide Control & form wrapper children elements
const Form = ({
  children,
  control,
  rules = {},
  controlProps = {},
  ...rest
}) => (
  <form {...rest}>
    <ControllerContext.Provider value={{ control, rules, controlProps }}>
      {children}
    </ControllerContext.Provider>
  </form>
);

// Map child component into a controller if control props is passed
const Field = ({ field, ...rest }) => {
  // Get control form props
  const restControl = {
    control: rest.control,
    rules: rest.rules,
    controlProps: rest.controlProps,
  };

  // Get control from form context
  const formControl = useContext(ControllerContext);

  const { control, rules, controlProps } = restControl.control
    ? restControl
    : formControl;

  return control ? (
    <Controller
      name={rest.name}
      control={control}
      rules={rules[rest.name]}
      {...controlProps}
      render={(controls) => field({ controls, ...rest })}
    />
  ) : (
    field(rest)
  );
};

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
})((props) => {
  // Get error message from error or control.error
  const getError = (error1, error2, gutter) =>
    error1 ? error1 : error2 ? error2.message : gutter ? " " : "";

  return (
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
          label={label || name}
          error={Boolean(error || controls?.fieldState.error)}
          helperText={getError(error, controls?.fieldState.error, gutter)}
          {...controls?.field}
          {...others}
        />
      )}
    />
  );
});

// Get Paassword field with show/hide password btn
const PasswordControl = ({ ...others }) => {
  // Show to show/hide password state
  const [visible, setVisible] = useState(false);

  return (
    <TextControl
      type={visible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setVisible((v) => !v)}>
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
const CheckboxControl = withStyles({ root: { margin: 0 } })((props) => (
  <Field
    {...props}
    field={({ color = "default", name, label, controls, ...others }) => (
      <FormControlLabel
        control={<Checkbox color={color} />}
        label={label || name}
        checked={controls?.field.value}
        {...controls?.field}
        {...others}
      />
    )}
  />
));

// Get dropdown input
const SelectControl = (props) => (
  <Field
    {...props}
    field={({
      name = "dropdown",
      variant = "standard",
      label = "",
      options,
      styleProps,
      optionProps,
      controls,
      ...others
    }) => (
      <FormControl variant={variant} {...styleProps}>
        <InputLabel id={`${name.replaceAll(" ", "-")}-id`}>
          {label || name}
        </InputLabel>
        <Select
          labelId={`${name.replaceAll(" ", "-")}-id`}
          id={`${name.replaceAll(" ", "-")}`}
          label={label || name}
          {...controls?.field}
          {...others}
        >
          {options.map((val, index) => (
            <MenuItem
              value={val?.val ? val.val : val}
              key={index}
              {...optionProps}
            >
              {val?.text ? val.text : val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
);

// Get Datepicker
const DatepickerControl = (props) => (
  <Field
    {...props}
    field={({
      name = "date",
      label,
      icon = "calendar_today",
      iconPosition = "start",
      variant = "standard",
      controls,
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
        {...controls?.field}
        {...other}
      />
    )}
  />
);

// Radiocontrol state
const RadioControl = (props) => (
  <Field
    {...props}
    field={({
      name = "",
      label = "",
      direction = "",
      options,
      hideLabel = false,
      controls,
      styleProps,
      ...others
    }) => (
      <FormControl {...styleProps}>
        {!hideLabel && (
          <FormLabel component="legend">{label || name}</FormLabel>
        )}
        <RadioGroup row={direction === "row"} {...controls?.field} {...others}>
          {options.map((val, index) => (
            <FormControlLabel
              value={val?.val ? val.val : val}
              key={index}
              control={<Radio />}
              label={val?.text ? val.text : val}
            />
          ))}
        </RadioGroup>
      </FormControl>
    )}
  />
);

// Get Slider input
const SliderControl = (props) => {
  const mapToValue = (label) =>
    props.markers.find((mark) => mark.label === label)?.value || 0;

  const mapToLabel = (value) =>
    props.markers.find((mark) => mark.value === value)?.label || "";

  const getValue = (controls, value) => {
    const val = controls?.field.value || value;
    return props.returnLabel ? mapToValue(val) : val;
  };

  const setValue = (newVal, controls, onChange) => {
    const setter = controls?.field.onChange || onChange;
    setter(props.returnLabel ? mapToLabel(newVal) : newVal);
  };

  return (
    <Field
      {...props}
      field={({
        name,
        step = 1,
        markers = [],
        returnLabel = false,
        controls,
        styleProps,
        value,
        onChange,
        ...other
      }) => (
        <FormControl {...styleProps}>
          <FormLabel component="legend">{name}</FormLabel>
          <Slider
            step={returnLabel ? null : step}
            marks={markers}
            {...controls?.field}
            value={getValue(controls, value)}
            onChange={(_, val) => setValue(val, controls, onChange)}
            {...other}
          />
        </FormControl>
      )}
    />
  );
};

export {
  Form,
  TextControl,
  PasswordControl,
  CheckboxControl,
  SelectControl,
  DatepickerControl,
  RadioControl,
  SliderControl,
};
