import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  makeStyles,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  PasswordControl,
  TextControl,
  Form,
  SelectControl,
} from "../Utils/Control";
import { signup, login } from "../../Service/UserFactory";
import { Controller, useForm } from "react-hook-form";
import DocumentTitle from "../DocumentTitle";
import { isPasswordValid } from "../Utils/Control/Controls.utils.js";
import { Link } from "react-router-dom";
import { EMAIL_REGEX } from "../../assets/data/Other";
import countryCodesList from "country-codes-list";
import CountrySelect from "./CountrySelect.jsx";
const useStyles = makeStyles((theme) => ({


  // Style to apply on login btn
  submitBtn: {
    width: "100%",
    height: "40px",
    borderRadius: 1 * theme.shape.borderRadius,
    paddingInline: theme.spacing(6),
    fontSize: theme.spacing(1.6),
    fontWeight: "bold",
    background: theme.palette.primary.main,
    color: theme.textOnPrimary,
    display: "block",
    marginTop: "20px",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
  countryDropdown: {
    minWidth: 10,
    marginLeft: theme.spacing(1 / 2),
    "& .MuiInput-formControl": {
      margin: 0,
      "&::before": { content: "", border: "none" },
    },
    "& .MuiInput-underline": { "&::after": { content: "", border: "none" } },

    "& .MuiSelect-root": {
      background: "transparent",
      paddingLeft: 4,
      paddingTop: 8,
    },
  },
  countryInput: {

    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 4,
    },
    "& .MuiInputAdornment-root": {
      width: 0,
      overflow: "hidden",
    },
    "&:focus-within .MuiInputAdornment-root, & .MuiInputAdornment-root.valued":
    {
      width: "unset",
      overflow: "visible",
    },
  },
  //sign up title
  title: {
    marginTop: theme.spacing(0.4),
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: "30px",
    display:"grid",
    placeItems:"center",
  },
  //Back to sign in page link
  signInLinkStyle: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  // Terms and conditions checkbox text
  termsAndConditions: {
    color: theme.palette.primary.light,
    "& .MuiTypography-root":{
      fontSize: "14px",
    },
  },
  contactBox: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  contact_no: {
    marginLeft:9, 
    minWidth: "16.25rem"
  }
}));
// Custom test input for contact number with country code dropdown selector
const ContactNumControl = ({ name, label, control, rules }) => {
  // Generate styles
  const classes = useStyles();

  // Get mapping of countryCode with callingCode
  const callingCodes = countryCodesList.customList(
    "countryCode",
    "+{countryCallingCode}"
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
          <InputAdornment position="start" className={value ? "valued" : ""}>
            <SelectControl
              name="option"
              label=" "
              placeholder="Code"
              styleProps={{ className: classes.countryDropdown }}
              options={Object.keys(callingCodes).map((key) => ({
                val: callingCodes[key],
                text: `${key} ${callingCodes[key]}`,
              }))}
              value={code}
              renderValue={(v) => v}
              onChange={(e) => onChange(`${e.target.value}-${num || ""}`)}
            />
          </InputAdornment>
        );

        return (
          <TextControl
            name={name}
            error={error?.message}
            noControls={true}
            variant="standard"
            label=" "
            placeholder="Contact No."
            size="small"
            fullWidth
            value={num === undefined ? "" : num}
            onChange={(e) => onChange(`${code}-${e.target.value}`)}
            // InputProps={{ startAdornment: <Adornment /> }}
            className={classes.countryInput}
          />
        );
      }}
    />
  );
};

// Signup Component
export default function Signup({ title }) {
  DocumentTitle(title);

  // State to toggle between Sign In and Sign Up
  const [isSignIn, setIsSignIn] = useState(false);

  // Apply validation on field
  const validations = {
    first_name: { required: "First Name is required." },
    last_name: { required: "Last Name is required." },
    contact_no: { required: "Contact Number is required." },
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
    }
  };

  // TODO: Reset is not working
  const { handleSubmit, control, reset } = useForm({
    defaultValues: { contact_no: "" },
  });

  // handle on Submit
  const submit = async (data) => {
    // If it's a Sign Up form, handle signup
    if (!isSignIn) {
      // Check if all input valid and form is not loading
      if (!isLoading) {
        setLoading(true);
        // Call signup Service
        const status = await signup(data);
        setLoading(false);
        // If success
        if (status) {
          reset({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            contact_no: "+1-", // Set the default country code again
          });
        }
      }
    } else {
      // If it's a Sign In form, handle signin
      // Check if all input valid and form is not loading
      if (!isLoading) {
        setLoading(true);
        // Call login Service
        const status = await login(data);
        setLoading(false);
        // If success
        if (status) {
          // Redirect to the dashboard or home page
          // Replace this with your logic for navigating to the dashboard/home
          console.log("Logged in successfully!");
        }
      }
    }
  };

  // React state for loading status of submit btn
  const [isLoading, setLoading] = useState(false);

  // Get style
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" width={1} className={classes.root}>
      {isSignIn ? (
        // Show Sign In Form
        <Box>
          <Typography className={classes.title}>
            Sign In
          </Typography>
          <Form
            control={control}
            rules={validations}
            onSubmit={handleSubmit(submit)}
            autoComplete="off"
          >
            <TextControl
              type="email"
              name="email"
              size="small"
              fullWidth
              variant="standard"
              label=" "
              placeholder="Email"
            />
            <PasswordControl
              name="password"
              size="small"
              fullWidth
              variant="standard"
              label=" "
              placeholder="Password"
            />
            <Button className={classes.submitBtn} type="submit">
              {isLoading ? (
                <CircularProgress color="inherit" size={35} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
          <Button onClick={() => setIsSignIn(false)}>
            Switch to Sign Up
          </Button>
        </Box>
      ) : (
        // Show Sign Up Form
        <Box>
          <Typography variant="h5" className={classes.title}>
            Sign Up
          </Typography>
          <Form
            control={control}
            rules={validations}
            onSubmit={handleSubmit(submit)}
            autoComplete="off"
          >
            <Box sx={{ display: "flex" }}>
              <TextControl
                name="first_name"
                size="small"
                fullWidth
                variant="standard"
                label=" "
                placeholder="First Name"
              />
              <Box width={20} />
              <TextControl
                name="last_name"
                size="small"
                fullWidth
                variant="standard"
                label=" "
                placeholder="Last Name"
              />
            </Box>
            <Box
              className={classes.contactBox}
            >
              <Controller
                name="country_code"
                control={control}
                render={({ field }) => (
                  <CountrySelect
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Box className={classes.contact_no}>
                <TextControl
                  type="number"
                  name="contact_no"
                  size="small"
                  fullWidth
                  variant="standard"
                  label=" "
                  placeholder="Contact Number"
                />
              </Box>
            </Box>
            <TextControl
              type="email"
              name="email"
              size="small"
              fullWidth
              variant="standard"
              label=" "
              placeholder="Email"
            />
            <PasswordControl
              name="password"
              size="small"
              fullWidth
              variant="standard"
              label=" "
              placeholder="Password"
            />
            <Box>
              <FormControlLabel
              className={classes.termsAndConditions}
                control={<Checkbox />}
                label="By signing up you accept the terms of services"
                size="small"
              />
            </Box>

            <Button className={classes.submitBtn} type="submit">
              {isLoading ? (
                <CircularProgress color="inherit" size={35} />
              ) : (
                "Create"
              )}
            </Button>
          </Form>
          <Box textAlign="center" marginTop={5} sx={{ color: "grey" }}>
            <b>Already have an account?</b>
            <Link to="/login" className={classes.signInLinkStyle}>
              <Typography variant="p"> <b>Sign in</b></Typography>
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
}
