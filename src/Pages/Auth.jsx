import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box } from "@material-ui/core";
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
    boxShadow: "0 6px 16px 0 rgb(0 0 0 / 20%)",
    borderRadius: "1rem",
  },

  tabHeadingContainer: {
    width: "100%",
    padding: "1rem 1.8rem",
    display: "flex",
  },

  // "@keyframes slide": {
  //   "0%": {
  //     // transform: "scaleX(1)"
  //     // width: "50%",
  //     transform: "translateX(0)",
  //   },
  //   "50%": {
  //     // transform: "scaleX(1.05)"
  //     // width: "60%",
  //     transform: "translateX(110%)"
  //   },
  //   "100%": {
  //     // transform: "scaleX(1)"
  //     // width: "50%",
  //     transform: "translateX(100%)"
  //   },
  // },

  // Heading TAB style
  tabHeadings: {
    width: "50%",
    padding: `${theme.spacing(2)}px 0`,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#333",
    zIndex: "2",
    transition: "all .5s",
    // "&:first-child": { background: "none"  },
    // "&:last-child": { background: "none" },
    "&.active": {color: "#fff"},
  },

  tabBackground: {
    height: "100%",
    width: "50%",
    position:"absolute",
    borderRadius: "1rem",
    zIndex: 1,
    background: "linear-gradient(to right , darkblue, blue)",
    transition: "transform .3s",
    "&.active": {
      transform: "translateX(100%)",
    },
  },

  // Add horizontal spacing in body
  formBody: { 
    padding: `0 ${theme.spacing(4)}px`,
  },

  // // Horizontal seperator from FORM to connection
  // seperatorText: {
  //   display: "flex",
  //   justifyContent: "center",
  //   // Add border bottom, as seperator
  //   "&::before, &::after": {
  //     content: '""',
  //     whiteSpace: "pre",
  //     margin: "auto 0",
  //     flex: "1 1",
  //     borderBottom: "1px solid #999",
  //   },
  //   "&::before": { marginRight: theme.spacing(1) },
  //   "&::after": { marginLeft: theme.spacing(1) },
  // },

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
          <Box padding="1rem 1.8rem 0.8rem">
            <Box display="flex" position="relative" marginBottom={2}>
              <Box className={`${classes.tabBackground} ${loginState ? "active" :  ""}`}></Box>
            <Typography
              variant="h5"
              className={`${classes.tabHeadings} ${!loginState ? "active" : ""}`}
              onClick={() => {
                history.push("/signup");
                setPageState(false);
              }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="h5"
              className={`${classes.tabHeadings} ${loginState ? "active" : ""}`}
              onClick={() => {
                history.push("/login");
                setPageState(true);
              }}
            >
              Login
            </Typography>
            </Box>
          </Box>

          <Box className={classes.formBody}>
            {loginState ? <Login title="LOGIN" /> : <Signup title="SIGN UP" />}
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
