import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box, Grid } from "@material-ui/core";
import { useState } from "react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import DocumentTitle from "../Components/DocumentTitle";
import svgBackground from "../assets/img/colored_patterns.svg"

// primary back color: #00A19D 
// secondary back color: #FFF8E5 


// CSS class generator
const useStyles = makeStyles((theme) => ({
  // Root grid container of page
  root: {
    background: `linear-gradient(to right bottom , ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
    borderRadius: 2 * theme.shape.borderRadius,
    maxWidth: "90%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "80%",
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "70%",
      padding: theme.spacing(2),
    },
    padding: "1rem",
  },

  body: {

  },

  // Form Container
  formContainer: {
    width: "100%",
    maxWidth: 350,
    marginLeft: "auto",
    padding: `0 ${theme.spacing(2.5)}px`,
    paddingBottom: theme.spacing(1),
    borderRadius: 4 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[23],
    [theme.breakpoints.down("md")]: { padding: `0 ${theme.spacing(2)}px` },
    [theme.breakpoints.down("sm")]: { padding: `0 ${theme.spacing(1.5)}px` },
    [theme.breakpoints.down("xs")]: {
      marginRight: "auto",
      padding: `0 ${theme.spacing(1)}px`,
    },
  },

  // formHeading to contains tab toggler
  formHeading: {
    display: "flex",
    position: "relative",
    borderRadius: 4 * theme.shape.borderRadius,
    overflow: "hidden",
    border: `1px solid ${theme.palette.grey[400]}`,
  },

  // Heading TAB style
  headings: {
    width: "50%",
    padding: `${theme.spacing(1)}px 0`,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    zIndex: "2",
    transition: "all .5s  cubic-bezier(.63,-0.58,.63,1.58)",
    "&.login": { color: theme.textOnPrimary },
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
function Auth({title}) {
  DocumentTitle(title);
  // Get Styles
  const classes = useStyles();

  // React Hook, to get current path
  const history = useHistory();

  // React state hook, to save login or sigin up state
  const [loginIn, setPageState] = useState(
    history.location.pathname === "/login"
  );
  // Method to login user
  const loginUser = () => {
    history.push("/login");
    setPageState(true);
  };
  // MEthod to signuo user
  const signupUser = () => {
    history.push("/signup");
    setPageState(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      style ={{
        backgroundImage: `url(${svgBackground}), linear-gradient(to right bottom, #D5EEBB, #7FC8A9) `,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid
        container
        spacing={2}
        className={`${classes.root} ${!loginIn ? "login" : ""}`}
      >
        <Grid item xs={12} sm={5} md={7}>
          <Box textAlign="center" margin="auto">
            <Typography variant="h1" color="secondary">
              CNCM
            </Typography>
            <Typography variant="h4" color="secondary">
              Welcome
            </Typography>
            <Typography variant="h6" color="secondary">
              We are happy to have you.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={7} md={5}>
          <main
            className={`${classes.formContainer} ${!loginIn ? "login" : ""}`}
          >
            <Box paddingTop={2} paddingBottom={3}>
              <Box className={classes.formHeading}>
                <Box
                  className={`${classes.tabBackgnd} ${loginIn ? "login" : ""}`}
                ></Box>
                <Typography
                  variant="subtitle1"
                  className={`${classes.headings} ${!loginIn ? "login" : ""}`}
                  onClick={signupUser}
                >
                  Sign Up
                </Typography>
                <Typography
                  variant="subtitle1"
                  className={`${classes.headings} ${loginIn ? "login" : ""}`}
                  onClick={loginUser}
                >
                  Login
                </Typography>
              </Box>
            </Box>

            <Box overflow="hidden">
              <Box className={`${classes.formBody} ${!loginIn ? "login" : ""}`}>
                <Signup title="SIGN UP" show={!loginIn} />
                <Login title="LOGIN" show={loginIn} />
              </Box>
            </Box>
          </main>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Auth;
