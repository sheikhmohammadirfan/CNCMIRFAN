import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box } from "@material-ui/core";
import { useState } from "react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

// CSS class generator
const useStyles = makeStyles((theme) => ({
  // Form Container
  formContainer: {
    width: 350,
    maxWidth: "90%",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[23],
    borderRadius: 4 * theme.shape.borderRadius,
    overflow: "hidden",
  },

  // headingContainer
  headingContainer: {
    display: "flex",
    position: "relative",
    borderRadius: 4 * theme.shape.borderRadius,
    overflow: "hidden",
    border: `1px solid ${theme.palette.grey[400]}`,
  },

  // Heading TAB style
  tabHeadings: {
    width: "50%",
    padding: `${theme.spacing(1)}px 0`,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    zIndex: "2",
    transition: "all .5s  cubic-bezier(.63,-0.58,.63,1.58)",
    "&.active": { color: theme.textOnPrimary },
  },

  tabBackground: {
    height: "100%",
    width: "50%",
    position: "absolute",
    borderRadius: 4 * theme.shape.borderRadius,
    zIndex: 1,
    background: `linear-gradient(to right , ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
    transition: "transform .5s cubic-bezier(.63,-0.58,.63,1.58)",
    "&.active": { transform: "translateX(100%)" },
  },
}));

// Main Component
function Auth() {
  // Get Styles
  const classes = useStyles();

  // React Hook, to get current path
  const history = useHistory();

  // React state hook, to save login or sigin up state
  const [loginIn, setPageState] = useState(
    history.location.pathname === "/login"
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <main className={classes.formContainer}>
        <Box paddingY={3}>
          <Box className={classes.headingContainer}>
            <Box
              className={`${classes.tabBackground} ${loginIn ? "active" : ""}`}
            ></Box>
            <Typography
              variant="subtitle1"
              className={`${classes.tabHeadings} ${!loginIn ? "active" : ""}`}
              onClick={() => {
                history.push("/signup");
                setPageState(false);
              }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="subtitle1"
              className={`${classes.tabHeadings} ${loginIn ? "active" : ""}`}
              onClick={() => {
                history.push("/login");
                setPageState(true);
              }}
            >
              Login
            </Typography>
          </Box>
        </Box>

        <Login title="LOGIN" show={loginIn} />
        <Signup title="SIGN UP" show={!loginIn} />
      </main>
    </Box>
  );
}

export default Auth;
