import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  useForm,
  TextControl,
  PasswordControl,
  CheckboxControl,
} from "./Control";
import { login } from "../Service/UserFactory";
import { Link, useHistory } from "react-router-dom";
import DocumentTitle from "./DocumentTitle";

// Default value for Login Form
const defaultValue = {
  email: "",
  password: "",
  remember: false,
};

// CSS class generator
const useStyles = makeStyles((theme) => ({
  // Forgot password styles
  forgotPassword: {
    textDecoration: "none",
    "& .MuiTypography-root": {
      color: theme.palette.primary.main,
      letterSpacing: 1,
      fontWeight: "bold",
      paddingRight: theme.spacing(1),
    },
  },
  // Style to apply on login btn
  submitBtn: {
    borderRadius: 3 * theme.shape.borderRadius,
    width: "100%",
    fontSize: theme.spacing(2.5),
    fontWeight: "bold",
    background: `linear-gradient(to right , ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
    color: theme.textOnPrimary,
  },
}));

// Login Component
function Login({ title, show }) {
  DocumentTitle(title);

  // Method to validate input
  const validateInput = (errObj) => {
    // Create temp error obj
    let tempObj = { ...error };

    // Check for error on input field
    if ("email" in errObj)
      tempObj.email =
        errObj.email && errObj.email.match(/$^|.+@.+..+/)
          ? ""
          : "Enter a valid email.";
    if ("password" in errObj)
      tempObj.password = errObj.password ? "" : "This field is required.";

    // Set error
    setError({ ...tempObj });

    // If submit btn pressed, then return value
    if (errObj === user)
      return Object.values(tempObj).every((inp) => inp === "");
  };

  // useForm
  const {
    value: user,
    error,
    setError,
    handleInputChange,
  } = useForm(defaultValue, true, validateInput);

  // handle on Submit
  const submit = (e) => {
    // Check if all input valid and form is not loading
    if (!isLoading && validateInput(user)) {
      setLoading(true); // Start loading
      // Call login Service
      login(user).then((status) => {
        // If success
        if (status) history.push("/");
        else setLoading(false);
      });
    }
  };

  // React state for loading status of submit btn
  const [isLoading, setLoading] = useState(false);

  // History react hook, to navigate
  const history = useHistory();
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" width={1} paddingX={1}>
      <TextControl
        type="email"
        name="email"
        value={user.email}
        onChange={handleInputChange}
        error={error.email}
        size="small"
      />
      <PasswordControl
        name="password"
        value={user.password}
        onChange={handleInputChange}
        error={error.password}
        size="small"
      />

      <Box textAlign="right" marginBottom={2}>
        <Link to="/" className={classes.forgotPassword}>
          <Typography variant="body2">Forgot password?</Typography>
        </Link>
      </Box>

      <Button className={classes.submitBtn} onClick={submit}>
        {isLoading ? <CircularProgress color="inherit" size={35} /> : "Login"}
      </Button>

      <CheckboxControl
        color="primary"
        name="remember"
        label={<Typography variant="body2">Stayed Logged in</Typography>}
        value={user.remember}
        onChange={handleInputChange}
      />
    </Box>
  );
}

export default Login;
