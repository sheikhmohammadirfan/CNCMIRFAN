import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GTranslateIcon from "@material-ui/icons/GTranslate";
import { useState } from "react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

/** CSS class generator  */
const useStyles = makeStyles((theme) => ({
  // Page container style
  container: {
    width: 500,
    maxWidth: "90%",
    position: "relative",
    padding: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px 0`,
    "& > *": { width: "100%" },
  },

  // Header Container to contain, Logo, subtitle, & slogan
  headerContainer: {
    textAlign: "center",
    // Make title, subtitle bold
    "& > h1, h4": { fontWeight: "bold", color: "darkblue" },
  },

  // Form Container
  formContainer: {
    margin: `${theme.spacing(3)}px 0`,
    backgroundColor: "#fff",
    boxShadow: "0px 6px 13px -1px rgba(0, 0, 0, 0.75)",
    borderRadius: theme.shape.borderRadius,
  },

  // Heading TAB style
  tabHeadings: {
    width: "50%",
    padding: `${theme.spacing(2)}px 0`,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: theme.spacing(2),
    transition: "box-shadow 0.3s ease-in-out",
    "&:first-child": { boxShadow: "inset -6px 0 15px 0 rgba(0, 0, 0, 0.1)" },
    "&:last-child": { boxShadow: "inset 6px 0 15px 0 rgba(0, 0, 0, 0.1)" },
    "&.active": { boxShadow: "none" },
  },

  // Add horizontal spacing in body
  formBody: { padding: `0 ${theme.spacing(4)}px` },

  // Horizontal seperator from FORM to connection
  seperatorText: {
    display: "flex",
    justifyContent: "center",
    // Add border bottom, as seperator
    "&::before, &::after": {
      content: '""',
      whiteSpace: "pre",
      margin: "auto 0",
      flex: "1 1",
      borderBottom: "1px solid #999",
    },
    "&::before": { marginRight: theme.spacing(1) },
    "&::after": { marginLeft: theme.spacing(1) },
  },

  // Social Icon container
  socialContainer: {
    display: "flex",
    justifyContent: "space-between",
    listStyleType: "none",
    padding: 0,
    "& li": {
      padding: theme.spacing(1),
      cursor: "pointer",
      transition: "color 0.2s linear",
      "& .MuiSvgIcon-root": { fontSize: "3.5rem" },
    },
    "& #facebook:hover, & #facebook:focus": {
      color: "#001E6C",
    },
    "& #github:hover, & #github:focus": {
      color: "#333",
    },
    "& #linkedin:hover, & #linkedin:focus": {
      color: "#035397",
    },
    "& #google:hover, & #google:focus": {
      color: "#BB8760",
    },
  },

  // Rules & Regulation style
  signupAgreement: {
    color: theme.palette.grey[700],
    textAlign: "center",
  },
}));

/**
 * Main Component
 *  */
function Auth() {
  // Get Styles
  const classes = useStyles();

  // React Hook, to get current path
  const history = useHistory();

  // React state hook, to save login or sigin up state
  const [loginState, setPageState] = useState(
    history.location.pathname === "/login"
  );

  return (
    <Box display="flex" justifyContent="center">
      <div className={classes.container}>
        <header className={classes.headerContainer}>
          <Typography variant="h1"> CNCM</Typography>
          <Typography variant="h4">Welcome</Typography>
          <Typography variant="h6">We are happy to have you.</Typography>
        </header>

        <main className={classes.formContainer}>
          <Box display="flex">
            <Typography
              variant="h5"
              className={`${classes.tabHeadings} ${!loginState && "active"}`}
              onClick={() => {
                history.push("/signup");
                setPageState(false);
              }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="h5"
              className={`${classes.tabHeadings} ${loginState && "active"}`}
              onClick={() => {
                history.push("/login");
                setPageState(true);
              }}
            >
              Login
            </Typography>
          </Box>

          <Box className={classes.formBody}>
            {loginState ? <Login title="LOGIN" /> : <Signup title="SIGN UP" />}

            <Typography variant="h5" className={classes.seperatorText}>
              or connect with
            </Typography>

            <ul className={classes.socialContainer}>
              <li>
                <FacebookIcon id="facebook" />
              </li>
              <li>
                <GitHubIcon id="github" />
              </li>
              <li>
                <LinkedInIcon id="linkedin" />
              </li>
              <li>
                <GTranslateIcon id="google" />
              </li>
            </ul>
          </Box>
        </main>

        <p className={classes.signupAgreement}>
          By signing up you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </Box>
  );
}

export default Auth;
