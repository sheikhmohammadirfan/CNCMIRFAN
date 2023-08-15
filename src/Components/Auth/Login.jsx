import { Box, Button, CircularProgress, makeStyles, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import { useState } from "react";
import { TextControl, PasswordControl, Form } from "../Utils/Control";
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
      fontSize: "16px",
      letterSpacing: 0,
      // fontWeight: "bold",
    },
    "&:hover": {
      color: theme.palette.secondary.dark,
    },
  },
  //Remember me and forgot pass 
  alignment: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  //Remember me checkbox
  Checkbox: {
    color: theme.palette.secondary.light,
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.main,
  },
  // Style to apply on login btn
  submitBtn: {
    width: "100%",
    display: "block",
    marginTop: "30px",
    marginBottom: "190px",
    borderRadius: "70px",
    // borderRadius: theme.shape.borderRadius,
    paddingInline: theme.spacing(8),
    fontSize: theme.spacing(1.6),
    fontWeight: "bold",
    background: theme.palette.primary.main,
    color: theme.textOnPrimary,
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  //Create new account
  newSign: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    marginBottom: 0,
  },
  //sign in title
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    // fontWeight: "bold",
    fontSize: "30px",
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
      data-test="login-container"
    >
      
      <Typography className={classes.title}>
        Sign In
      </Typography>

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
          sx={{ borderRadius: "20px" }}
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
        <Box className={classes.alignment}>
          <FormControlLabel
            className={classes.Checkbox}
            control={<Checkbox />}
            label="Remember Me"
            sx={{fontSize: "14px"}}
          />
          <Box>
            <Link to="/forgotpassword" className={classes.forgotPassword}>
              <Typography variant="body2">Forgot password?</Typography>
            </Link>
          </Box>
        </Box>
        <Button
          className={classes.submitBtn}
          type="submit"
          data-test="login-submit-btn"
        >
          {isLoading ? <CircularProgress color="inherit" size={35} /> : "Go"}
        </Button>
      </Form>
      <Box textAlign="center" sx={{ color: "grey"}}>
        <b>Don't have an account?</b>
        <Link to="/signup" className={classes.newSign}>
          <Typography variant="p"> <b>Create new account</b></Typography>
        </Link>
      </Box>
    </Box>
  );
}

Login.propTypes = {
  title: PropTypes.string.isRequired,
  homePage: PropTypes.func.isRequired,
};

export default Login;
