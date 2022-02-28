import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box, Grid, Hidden } from "@material-ui/core";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import DocumentTitle from "../Components/DocumentTitle";
import logo from "../assets/img/company_logo.png";

// CSS class generator
const useStyles = makeStyles((theme) => ({
  // Style for backgroud page
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgb(200, 200, 255, 0.4)",
  },

  // Root grid container of page
  root: {
    borderTop: "1px solid rgb(64, 86, 181, 0.2)",
    borderBottom: "1px solid rgb(64, 86, 181, 0.2)",
    width: "100vw",
    padding: `0 ${theme.spacing(20)}px`,
    background: "#fafaff",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: { padding: `0 ${theme.spacing(10)}px` },
    [theme.breakpoints.down("xs")]: { padding: "0" },
  },

  // Form Container
  formContainer: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: 350,
    marginRight: "auto",
    padding: `0 ${theme.spacing(2.5)}px`,
    paddingBottom: theme.spacing(1),
    borderRadius: 4 * theme.shape.borderRadius,
    [theme.breakpoints.down("md")]: { padding: `0 ${theme.spacing(2)}px` },
    [theme.breakpoints.down("sm")]: {
      padding: `0 ${theme.spacing(1)}px`,
      margin: "auto",
    },
  },

  // formHeading to contains tab toggler
  formHeading: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
    borderRadius: 4 * theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
  },

  // Heading TAB style
  headings: {
    width: "50%",
    padding: `${theme.spacing(1)}px 0`,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    cursor: "pointer",
    zIndex: 2,
    transition: "all .5s  cubic-bezier(.63,-0.58,.63,1.58)",
    "&.active": { color: theme.textOnPrimary },
  },

  // Background style for active tab heading
  tabBackgnd: {
    height: "100%",
    width: "50%",
    position: "absolute",
    borderRadius: 4 * theme.shape.borderRadius,
    zIndex: 1,
    background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
    transition: "transform .5s cubic-bezier(.63,-0.58,.63,1.58)",
    "&.login": { transform: "translateX(100%)" },
  },

  // Form fields container
  formBody: {
    display: "flex",
    width: "200%",
    transform: "translateX(-50%)",
    transition: "transform .5s cubic-bezier(.63,-0.58,.63,1.58)",
    "&.login": { transform: "translateX(0%)" },
  },
}));

/* AUTH ROOT COMPONENT */
export default function Auth({ title }) {
  DocumentTitle(title);
  // Get Styles
  const classes = useStyles();

  // React Hook, to get current path
  const history = useHistory();

  // React state hook, to save login or sigin up state
  const [loginIn, setPageState] = useState(
    history.location.pathname === "/signup"
      ? 0
      : history.location.pathname === "/login"
      ? 1
      : 2
  );

  // Method to login user
  const loginUser = () => history.push("/login");
  // Method to signup user
  const signupUser = () => history.push("/signup");
  // Method to goto home page
  const homePage = () => history.push("/");

  // React hook to update  state on path change
  useEffect(() => {
    if (history.location.pathname === "/signup") setPageState(0);
    else if (history.location.pathname === "/login") setPageState(1);
    else setPageState(2);
  }, [history.location.pathname]);

  return (
    <Box className={classes.page}>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} md={6}>
          <Box textAlign="center">
            <img src={logo} alt="logo" width="100%" style={{ maxWidth: 225 }} />
            <Typography variant="h4" color="inherit">
              Welcome
            </Typography>
            <Typography variant="h6" color="inherit">
              We are happy to have you.
            </Typography>
          </Box>
        </Grid>

        <Grid item sm={12} md={6}>
          <main className={classes.formContainer}>
            <Box paddingTop={2} paddingBottom={3}>
              <Box className={classes.formHeading}>
                <Box
                  className={`${classes.tabBackgnd} ${loginIn ? "login" : ""}`}
                ></Box>
                <Typography
                  variant="subtitle1"
                  className={`${classes.headings} ${!loginIn ? "active" : ""}`}
                  onClick={signupUser}
                >
                  Sign Up
                </Typography>
                <Typography
                  variant="subtitle1"
                  className={`${classes.headings} ${loginIn ? "active" : ""}`}
                  onClick={loginUser}
                >
                  Login
                </Typography>
              </Box>
            </Box>

            <Box overflow="hidden">
              <Box className={`${classes.formBody} ${loginIn ? "" : "login"}`}>
                <Signup title="SIGN UP" loginPage={loginUser} />
                <Login title="LOGIN" homePage={homePage} />
              </Box>
            </Box>

            {/* <SingleSignon /> */}

            <ForgotPassword
              title="FORGOT PASSWORD"
              show={loginIn === 2}
              login={loginUser}
            />
          </main>
        </Grid>
      </Grid>
    </Box>
  );
}
