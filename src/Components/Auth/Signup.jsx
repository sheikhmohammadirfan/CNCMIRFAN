import {
  Box,
  Button,
  CircularProgress,
  Icon,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  PasswordControl,
  TextControl,
  Form,
  SelectControl,
} from "../Utils/Control";
import { signup } from "../../Service/UserFactory";
import { Controller, useForm } from "react-hook-form";
import DocumentTitle from "../DocumentTitle";
import { isPasswordValid } from "../Utils/Control/Controls.utils.js";
import { EMAIL_REGEX } from "../../assets/data/Other";
import countryCodesList from "country-codes-list";

const useStyles = makeStyles((theme) => ({
  // Style to apply on login btn
  submitBtn: {
    borderRadius: 3 * theme.shape.borderRadius,
    width: "100%",
    fontSize: theme.spacing(2.5),
    fontWeight: "bold",
    background: `linear-gradient(to right , ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
    color: theme.textOnPrimary,
    marginBottom: theme.spacing(1),
  },
  countryDropdown: {
    minWidth: 80,
    marginLeft: theme.spacing(1 / 2),
    "& .MuiInput-formControl": {
      margin: 0,
      "&::before": { content: "", border: "none" },
    },
    "& .MuiInput-underline": { "&::after": { content: "", border: "none" } },
    "& .MuiSelect-root": {
      background: "transparent",
    },
  },
}));

// Custom test input for countact number with country code dropdown selector
const ContactNumControl = ({ name, label, control, rules }) => {
  // Generate styles
  const classes = useStyles();

  // Get mapping of countryCode with callingCode
  const callingCodes = countryCodesList.customList(
    "countryCode",
    "{countryCode} +{countryCallingCode}"
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules?.[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // Extract callingcode & number
        const [code, num] = (value || "").split("-");

        // Country code selection input
        const Adornment = () => (
          <InputAdornment position="start">
            <SelectControl
              name="option"
              label=" "
              styleProps={{ className: classes.countryDropdown }}
              options={Object.values(callingCodes)}
              value={code}
              onChange={(e) => onChange(`${e.target.value}-${num || ""}`)}
            />
          </InputAdornment>
        );

        return (
          <TextControl
            name={name}
            label={label}
            error={error?.message}
            noControls={true}
            variant="standard"
            size="small"
            fullWidth
            value={num === undefined ? "" : num}
            onChange={(e) => onChange(`${code}-${e.target.value}`)}
            InputProps={{ startAdornment: <Adornment /> }}
          />
        );
      }}
    />
  );
};

// Signup Component
export default function Signup({ title, loginPage }) {
  DocumentTitle(title);

  // Apply validation on field
  const validations = {
    first_name: { required: "First Name is required." },
    last_name: { required: "Last Name is required." },
    email: {
      pattern: {
        value: EMAIL_REGEX,
        message: "Invalid email address.",
      },
      required: "Email is required.",
    },
    password: {
      required: "Password is required.",
      validate: { invalid: (val) => val === "" || isPasswordValid(val) },
    },
    contact_no: {
      required: "Number is required.",
      validate: {
        invalid: (val) => {
          const [code, num] = val.split("-");
          if (!num?.match(/^\d{10}$/)) return "Contact no. invalid.";
          if (code === "") return "Select Country code.";
          return true;
        },
      },
    },
  };

  // TODO: Reset is not working
  const { handleSubmit, control, reset } = useForm();

  // handle on Submit
  const submit = async (data) => {
    // update contact number
    if (data.contact_no) {
      data.contact_no = data.contact_no.split(" ")[1];
    }

    // Check if all input valid and form is not loading
    if (!isLoading) {
      setLoading(true);
      // Call signup Service
      const status = await signup(data);
      setLoading(false);
      // If success
      if (status) {
        loginPage();
        reset({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
      }
    }
  };

  // React state for loading status of submit btn
  const [isLoading, setLoading] = useState(false);

  // Get style
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" width={1} paddingX={1}>
      <Form
        control={control}
        rules={validations}
        onSubmit={handleSubmit(submit)}
        autoComplete="off"
      >
        <Box display="flex">
          <TextControl
            name="first_name"
            label="first name"
            size="small"
            fullWidth
            variant="standard"
          />
          <Box width={20} />
          <TextControl
            name="last_name"
            label="Last name"
            size="small"
            fullWidth
            variant="standard"
          />
        </Box>
        <ContactNumControl
          control={control}
          rules={validations}
          label="contact no"
          name="contact_no"
        />
        <TextControl
          type="email"
          name="email"
          size="small"
          fullWidth
          variant="standard"
        />
        <PasswordControl
          name="password"
          size="small"
          fullWidth
          variant="standard"
        />

        <Button className={classes.submitBtn} type="submit">
          {isLoading ? (
            <CircularProgress color="inherit" size={35} />
          ) : (
            "Create"
          )}
        </Button>
      </Form>
    </Box>
  );
}
