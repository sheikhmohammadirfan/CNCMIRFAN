import { Box, Button, CircularProgress, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { PasswordControl, TextControl, Form } from "../Utils/Control";
import { signup } from "../../Service/UserFactory";
import { useForm } from "react-hook-form";
import DocumentTitle from "../DocumentTitle";
import { DisableAutoComplete } from "../Utils/Utils";
import { EMAIL_REGEX } from "../../assets/data/Other";

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
    password: { required: "Password is required." },
  };

  // TODO: Reset is not working
  const { handleSubmit, control, reset } = useForm();

  // handle on Submit
  const submit = async (data) => {
    // Check if all input valid and form is not loading
    if (!isLoading) {
      setLoading(true);
      // Call signup Service
      const status = await signup(data);
      setLoading(false);
      // If success
      if (status) {
        reset();
        loginPage();
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
      >
        <TextControl
          name="first_name"
          label="first name"
          size="small"
          fullWidth
          variant="standard"
          {...DisableAutoComplete()}
        />
        <TextControl
          name="last_name"
          label="label name"
          size="small"
          fullWidth
          variant="standard"
          {...DisableAutoComplete()}
        />
        <TextControl
          type="email"
          name="email"
          size="small"
          fullWidth
          variant="standard"
          {...DisableAutoComplete()}
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
