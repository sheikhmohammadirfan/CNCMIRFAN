import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import {
  TextControl,
  PasswordControl,
  CheckboxControl,
  Form,
} from "../Utils/Control";
import { login } from "../../Service/UserFactory";
import { Link } from "react-router-dom";
import DocumentTitle from "../DocumentTitle";
import { useForm } from "react-hook-form";
import { EMAIL_REGEX } from "../../assets/data/Other";
import PropTypes from "prop-types";

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
    borderRadius: 2 * theme.shape.borderRadius,
    width: "100%",
    fontSize: theme.spacing(2),
    fontWeight: "bold",
    background: theme.palette.primary.main,
    color: theme.textOnPrimary,
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
}));

// Login Component
function Login({ title, homePage }) {
  DocumentTitle(title);

  // Rules for validation for each field
  const validation = {
    email: {
      pattern: {
        value: EMAIL_REGEX,
        message: "Invalid email address.",
      },
      required: "Email is required.",
    },
    password: { required: "Password is required." },
  };

  const { handleSubmit, control } = useForm();

  // handle on Submit
  const submit = async (data) => {
    console.log("s");
    // Check if all input valid and form is not loading
    if (!isLoading) {
      setLoading(true);
      // Call login Service
      const status = await login(data);
      setLoading(false);
      // If success
      if (status) homePage();
    }
  };

  // React state for loading status of submit btn
  const [isLoading, setLoading] = useState(false);

  // GEt styles
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={1}
      paddingX={1}
      data-test="login-container"
    >
      <Form
        control={control}
        rules={validation}
        onSubmit={handleSubmit(submit)}
        autoComplete="off"
      >
        <TextControl
          type="email"
          name="email"
          size="small"
          variant="outlined"
          label=" "
          placeholder="Email"
          fullWidth
          data-test="login-email-field"
        />
        <PasswordControl
          name="password"
          size="small"
          variant="outlined"
          label=" "
          placeholder="Password"
          fullWidth
          data-test="login-password-field"
        />

        <Box textAlign="right" marginBottom={2}>
          <Link to="/forgotpassword" className={classes.forgotPassword}>
            <Typography variant="body2">Forgot password?</Typography>
          </Link>
        </Box>

        <Button
          className={classes.submitBtn}
          type="submit"
          data-test="login-submit-btn"
        >
          {isLoading ? <CircularProgress color="inherit" size={35} /> : "Go"}
        </Button>

        <CheckboxControl
          color="primary"
          name="remember"
          label={<Typography variant="body2">Stay Logged in</Typography>}
          noControls={true}
        />
      </Form>
    </Box>
  );
}
Login.propTypes = {
  title: PropTypes.string.isRequired,
  homePage: PropTypes.func.isRequired,
};

export default Login;
