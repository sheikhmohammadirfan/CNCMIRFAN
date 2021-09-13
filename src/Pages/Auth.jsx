import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box, Grid, Hidden } from "@material-ui/core";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import DocumentTitle from "../Components/DocumentTitle";
import svgBackground from "../assets/img/login_background.svg";
import logo from "../assets/img/company_logo_large.webp";
import SingleSignon from "../Components/Auth/SingleSignon";

// CSS class generator
const useStyles = makeStyles((theme) => ({
  // Style for backgroud page
  page: {
    minHeight: "100vh",
    height: "min-content",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgb(64, 86, 181, 0.1)",
    backgroundImage: `url(${svgBackground}), linear-gradient(to right bottom, #D5EEBB, #7FC8A9)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },

  // Root grid container of page
  root: {
    maxWidth: "90%",
    background: `linear-gradient(to right bottom , ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
    borderRadius: 2 * theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: { maxWidth: "80%" },
    [theme.breakpoints.up("lg")]: { maxWidth: "70%" },
  },

  // Form Container
  formContainer: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: 350,
    marginLeft: "auto", // Push form on right on large screen
    padding: `0 ${theme.spacing(2.5)}px`,
    paddingBottom: theme.spacing(1),
    borderRadius: 4 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("md")]: { padding: `0 ${theme.spacing(2)}px` },
    [theme.breakpoints.down("sm")]: { padding: `0 ${theme.spacing(1.5)}px` },
    // Center align form in small devices
    [theme.breakpoints.down("xs")]: {
      marginRight: "auto",
      padding: `0 ${theme.spacing(1)}px`,
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

// Main Component
function Auth({ title }) {
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
        <Grid item xs={12} sm={5} md={7}>
          <Box textAlign="center" style={{ color: "white" }}>
            <img src={logo} alt="logo" width="100%" />
            <Hidden xsDown>
              <Typography variant="h1" color="inherit">
                CNCM
              </Typography>
              <Typography variant="h4" color="inherit">
                Welcome
              </Typography>
              <Typography variant="h6" color="inherit">
                We are happy to have you.
              </Typography>
            </Hidden>
          </Box>
        </Grid>

        <Grid item xs={12} sm={7} md={5}>
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

            <SingleSignon />

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

export default Auth;
