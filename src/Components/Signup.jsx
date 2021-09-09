import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { TextControl, useForm } from "./Control";
import { useHistory } from "react-router-dom";
import { signup } from "../Service/UserFactory";
import DocumentTitle from "./DocumentTitle";

// Default value for siginup form
const defaultValue = {
  name: "",
  email: "",
  password: "",
};

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
}));

// Signup Component
function Signup({ title, show }) {
  DocumentTitle(title);
  // Method to validate input
  const validateInput = (errObj) => {
    // Create temp error obj
    let tempObj = { ...error };

    // Check for error on input field
    if ("name" in errObj)
      tempObj.name = errObj.name ? "" : "This field is required.";
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
      // Call signup Service
      signup(user).then((status) => {
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
  // Get style
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" width={1} paddingX={1}>
      <TextControl
        name="name"
        value={user.name}
        onChange={handleInputChange}
        error={error.name}
        size="small"
      />
      <TextControl
        type="email"
        name="email"
        value={user.email}
        onChange={handleInputChange}
        error={error.email}
        size="small"
      />
      <TextControl
        type="password"
        name="password"
        value={user.password}
        onChange={handleInputChange}
        error={error.password}
        size="small"
      />

      <Button className={classes.submitBtn} onClick={submit}>
        {isLoading ? <CircularProgress color="inherit" size={35} /> : "Create"}
      </Button>
    </Box>
  );
}

export default Signup;
