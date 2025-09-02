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
      color:theme.palette.primary.main,
      fontSize: "15.5px",
      letterSpacing: 0,
    },
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },

  //Remember me and forgot pass alignment
  rememberMeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    marginTop: "8px",
  },
  // Styling for the "Remember Me" checkbox
  rememberMe: {
    color:theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    "& .MuiTypography-root": {
      fontSize: "15.5px",
    }
  },
  // Style to apply on login btn
  submitBtn: {
    width: "100%",
    height: "40px", 
    display: "block",
    marginTop: "35px",
    marginBottom: "70px",
    borderRadius: 1 * theme.shape.borderRadius,
    paddingInline: theme.spacing(6),
    fontSize: theme.spacing(1.6),
    fontWeight: "bold",
    backgroundColor:theme.palette.primary.main,
    color: theme.textOnPrimary,
    "&:hover": {
      background:theme.palette.primary.light,
    },
  },
  // Styling for the "Create new account" link
  createAccountLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    marginBottom: 0,
  },
  //sign in title
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    display:"grid",
    placeItems:"center",
  },

  //Media Query
  "@media (max-width: 315px)": {
    rememberMe: {
      "& .MuiTypography-root": {
        fontSize: "13.5px",
      }
    },
    forgotPassword:{
      "& .MuiTypography-root":{
        fontSize: "13.5px",
      },
    }
  },
  "@media (min-width: 316px) and (max-width: 328px)": {
    rememberMe: {
      "& .MuiTypography-root": {
        fontSize: "14.5px",
      }
    },
    forgotPassword:{
      "& .MuiTypography-root":{
        fontSize: "14.5px",
      },
    }
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
      className={classes.root}
    >

      <Typography className={classes.title} variant="h4">
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
          variant="standard"
          label=" "
          placeholder="Email"
          fullWidth
          data-test="login-email-field"
        />
  
        <PasswordControl
          name="password"
          size="small"
          variant="standard"
          label=" "
          placeholder="Password"
          fullWidth
          data-test="login-password-field"
        />
        <Box className={classes.rememberMeContainer}>
          <FormControlLabel
            className={classes.rememberMe}
            control={<Checkbox />}
            label="Remember Me"
            sx={{ fontSize: "14px" }}
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
      <Box textAlign="center" sx={{ color: "grey", fontSize: "13.5px" }} >
        <b>Don't have an account?</b>
        <Link to="/signup" className={classes.createAccountLink}>
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
