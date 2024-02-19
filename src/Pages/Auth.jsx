import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box, Grid, Hidden } from "@material-ui/core";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import DocumentTitle from "../Components/DocumentTitle";
// import logo from "../assets/img/company_logo.png";
// import ParamsRoutes from "../Components/Utils/Routers/ParamsRoutes";
import ResetPassword from "../Components/Auth/ResetPassword";

// CSS class generator
const useStyles = makeStyles((theme) => ({

  // Page
  page: {
    width: "100%",
    height: "100%",
    background: "white",
    paddingBlock: theme.spacing(2),
  },

  // Root container
  root: {
    width: "95%",
    height: "90%",
    maxWidth: 400,
    marginInline: `auto`,
    borderRadius: theme.shape.borderRadius * 2,
    border: `2px solid ${theme.palette.grey[300]}`,
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: { padding: theme.spacing(1) },
    marginTop: "27px"
  },
  //Sign in
  login: {
    margin: "25px auto",
    color: theme.palette.primary.main,
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
    "& .MuiOutlinedInput-root":{
      borderRadius: "50px",
    },
  },

  // formHeading to contains tab toggler
  formHeading: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
  },

  // Heading TAB style
  headings: {
    width: "50%",
    padding: `${theme.spacing(3 / 4)}px 0`,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 2,
    cursor: "pointer",
    zIndex: 2,
    transition: "all .5s  cubic-bezier(.63,-0.58,.63,1.58)",
    color: theme.palette.primary.main,
    "&.active": { color: theme.textOnPrimary },
  },

  // Background style for active tab heading
  tabBackgnd: {
    height: "100%",
    width: "50%",
    position: "absolute",
    borderRadius: theme.shape.borderRadius,
    zIndex: 1,
    background: theme.palette.primary.main,
    transition: "transform .5s cubic-bezier(.63,-0.58,.63,1.58)",
    "&.login": { transform: "translateX(100%)" },
  },

  // Form fields container
  formBody: {
    marginTop: "7px",
    display: "flex",
    width: "200%",
    transform: "translateX(0%)",
    transition: "transform .5s cubic-bezier(.63,-0.58,.63,1.58)",
    "&.login": { transform: "translateX(-50%)" },
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
        : !history.location.pathname.match(/resetpassword.*/)
          ? 2
          : 3
  );

  // Method to login user
  const loginUser = () => history.push("/login");
  // Method to signup user
  const signupUser = () => history.push("/signup");
  // Method to goto home page
  const homePage = () => history.push("/");

  // React hook to update  state on path change
  React.useEffect(() => {
    if (history.location.pathname === "/signup") setPageState(0);
    else if (history.location.pathname === "/login") setPageState(1);
    else if (history.location.pathname === "/forgotpassword") setPageState(2);
    else setPageState(3);
  }, [history.location.pathname]);

  return (
    <Box className={classes.page}>
      <Box className={classes.root}>
        <main className={classes.formContainer}>

          <Box overflow="hidden">
            <Box
              className={`${classes.formBody} ${loginIn ? "login" : ""}`}
              data-test="form-wrapper"
            >
              <Signup title="SIGN UP" loginPage={loginUser} />
              <Login title="LOGIN" homePage={homePage} />
            </Box>
          </Box>

          <ForgotPassword
            title="FORGOT PASSWORD"
            show={loginIn === 2}
            login={loginUser}
          />
        </main>
      </Box>
      {history.location.pathname.match(/resetpassword.*/) && (
        <ResetPassword
          path={history.location.pathname}
          onClose={() => history.replace("/login")}
        />
      )}
    </Box>
  );
}
