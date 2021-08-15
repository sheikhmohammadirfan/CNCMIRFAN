import { Box, Button, CircularProgress } from "@material-ui/core";
import React, { useState } from "react";
import { useForm, TextControl } from "./Control";
import { login } from "../Service/UserFactory";
import { useHistory } from "react-router-dom";

// Default value for Login Form
const defaultValue = {
  email: "",
  password: "",
};

/**
 * Login Component
 * */
function Login() {
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
    // Check if all input valid
    if (validateInput(user)) {
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
  const [startLoading, setLoading] = useState(false);

  // History react hook, to navigate
  const history = useHistory();

  return (
    <Box display="flex" flexDirection="column">
      <TextControl
        type="email"
        name="email"
        style={{ marginBottom: 16 }}
        value={user.email}
        onChange={handleInputChange}
        error={error.email}
      />
      <TextControl
        type="password"
        name="password"
        style={{ marginBottom: 16 }}
        value={user.password}
        onChange={handleInputChange}
        error={error.password}
      />

      <Button
        variant="contained"
        color="secondary"
        style={{
          marginBottom: 16,
          width: "max-content",
          marginLeft: "auto",
        }}
        endIcon={startLoading && <CircularProgress color="inherit" size={20} />}
        onClick={submit}
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;
