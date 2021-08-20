import { Box, Button, CircularProgress } from "@material-ui/core";
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

/**
 * Signup Component
 * */
function Signup(props) {
  DocumentTitle(`CNCM | ${props.title}`);
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
  const handleOnSubmit = (e) => {
    // Check if all input valid
    if (validateInput(user)) {
      setLoading(true); // Start loading
      // Call login Service
      signup(user).then((status) => {
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
        name="name"
        style={{ marginBottom: 16 }}
        value={user.name}
        onChange={handleInputChange}
        error={error.name}
      />
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
        onClick={handleOnSubmit}
      >
        Create
      </Button>
    </Box>
  );
}

export default Signup;
