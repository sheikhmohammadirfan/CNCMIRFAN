import { Box, Button, CircularProgress, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useForm, TextControl } from "./Control";
import { login } from "../Service/UserFactory";
import { useHistory } from "react-router-dom";
import DocumentTitle from "./DocumentTitle";

// Default value for Login Form
const defaultValue = {
  email: "",
  password: "",
};

const useStyles = makeStyles((theme) => ({
  forgotRow : {
    height: "3.5rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    
    "& label" : {
      cursor: "pointer",
      marginRight: "auto",
    },
    "& input": {
      cursor: "pointer",
      marginRight: "5px",
    },

    "& a": {
      textDecoration: "none",
      color: "darkblue",
      borderBottom: "1px solid transparent",
      transition: "textDecoration 0.3s",
    },

    "& a:hover": {
      textDecoration: "underline",
    }

  },
}));
/**
 * Login Component
 * */
function Login({ title }) {
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
  const classes = useStyles();

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

      <Box className={classes.forgotRow}>
        <input type="checkbox" name="checkBox" id="check" />
        <label htmlFor="check">Remeber me</label>
        <a href="/">Forgot password ?</a>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        style={{
          marginTop: ".2rem",
          borderRadius: "1rem",
          marginBottom: "1.7rem",
          fontSize: "1.15rem",
          fontWeight: "bold",
          letterSpacing: "1px",
          width: "100%",
          padding: "0.8rem 1.35rem",
          marginLeft: "auto",
          background: "linear-gradient(to right , darkblue, blue)",
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
