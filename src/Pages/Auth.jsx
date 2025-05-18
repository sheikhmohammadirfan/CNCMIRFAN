import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Typography, Box, Grid, Hidden } from "@material-ui/core";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import DocumentTitle from "../Components/DocumentTitle";
import dummyImg from "../assets/img/heroImg2.png";
// import logo from "../assets/img/company_logo.png";
// import ParamsRoutes from "../Components/Utils/Routers/ParamsRoutes";
import ResetPassword from "../Components/Auth/ResetPassword";

// CSS class generator
const useStyles = makeStyles((theme) => ({

  // Page
  page: {
    overflow:"hidden",
    position:"relative",
    width: "100%",
    height: "100vh",
    display:"flex",
  },

  page_elmnt_1:{
    backgroundColor:theme.palette.primary.main,
    width:"50%",
    height:"100%",
    padding:"3rem 2rem",
  },

  listItemsContainer:{
    display:"flex",
    padding:"0",
    margin:"0.8rem 0 0 0",
    listStyle:"none",
    gap:"1rem",
    justifyContent:"flex-start",
    alignItems:"flex-start",
    
  },

listItems:{
  color: theme.palette.primary.main,
  height:"max-content",
  padding:"0.5rem",
  width:"max-content",
  backgroundColor:"white",
  border:"none",
  borderRadius: 1 * theme.shape.borderRadius,
}
,
  // Root container
  root: {
    position: "relative",
    width: "50%",
    display:"grid",
    placeItems:"center",
  },
  //Sign in
  login: {
    margin: "25px auto",
    color: theme.palette.primary.main,
  },

  // Form Container
  formContainer: {
    position: "absolute",
    overflow: "hidden",
    maxWidth: 450,
    padding: `0 ${theme.spacing(5.5)}px`,
    paddingBottom: theme.spacing(1),
    borderRadius: 1 * theme.shape.borderRadius,
    [theme.breakpoints.down("md")]: { padding: `0 ${theme.spacing(2)}px` },
    [theme.breakpoints.down("sm")]: {
      padding: `0 ${theme.spacing(1)}px`,
      margin: "auto",
    },
    "& .MuiOutlinedInput-root":{
      border:"none"
    },
    backgroundColor:"white",
    boxShadow:`
    7.8px 2.1px 10px rgba(0, 0, 0, 0.07),
    62px 17px 80px rgba(0, 0, 0, 0.035)
  `
  },

  // formHeading to contains tab toggler
  formHeading: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
    "& .makeStyles-title-44":{
      display:"grid",
      placeItems:"center",
    }
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
    gap:"20px",
    width: "200%",
    transform: "translateX(0%)",
    transition: 'transform 300ms',
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
      <Box className={classes.page_elmnt_1}>
        <Box style={{fontSize:"20px", fontWeight:"bolder", color:"white"}}>FALCON</Box>
        <Box style={{fontSize:"35px", color:"white", display:"flex", flexDirection:"column", margin:"2.5rem 0 0 0"}}>Automate Your <span style={{fontSize:"35px", fontWeight:"bolder", color:"white"}}>Compliance Processes <span style={{fontSize:"20px", fontWeight:"lighter"}}>in</span> </span> </Box>
        <Box> 
          <ul className={classes.listItemsContainer}>
            <li className={classes.listItems}>SOC 2</li>
            <li className={classes.listItems}>FISMA</li>
            <li className={classes.listItems}>CMMC</li>
            <li className={classes.listItems}>ISO 27001</li>
            <li className={classes.listItems}>FedRAMP</li>
          </ul> 
          </Box>
          <Box style={{height:"max-content", width:"100%", display:"grid", placeItems:"center"}}><img src={dummyImg} style={{marginTop:"3rem",height:"400px", width:"400px"}}/></Box>
          
      </Box>
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
