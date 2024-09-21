import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  makeStyles,
  responsiveFontSizes,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Flip, toast } from "react-toastify";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Auth from "./Pages/Auth";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./Components/Utils/Routers/ProtectedRoutes";
import Verify from "./Pages/Verify";
import Home from "./Pages/Home";
import Poam from "./Pages/Poam";
import Email from "./Pages/Email";
import CreateIssue from "./Components/Jira/CreateIssue";
import UpdateIssue from "./Components/Jira/UpdateIssue";
import Profile from "./Pages/Profile";
import Integrate from "./Pages/Integrate";
import ParamsRoutes from "./Components/Utils/Routers/ParamsRoutes";
import RiskManagement from "./Pages/RiskManagement";
import React from "react";
import AccessManagement from "./Pages/AccessManagement";
import VendorManagement from "./Pages/VendorManagement";
import Rbac from "./Pages/Rbac";
import RestrictedRoutes from "./Components/Utils/Routers/RestrictedRoutes";

// Custom values
const sidebarSmall = 50;
const sidebarLarge = 285;
const headerHeight = 40;

/** Theme generator */
let theme = createTheme({
  sidebarSmall,
  sidebarLarge,
  headerHeight,
  textOnPrimary: "#ffffff",
  palette: {
    primary: {
      // main: "#008374",
      main: "#4477CE",
      dark: "#4477CE",
      light: "#2a96b5",
      light_grey: "#989898",
    },
    secondary: {
      main: "#22577A",
      dark: "#22577A",
      light: "#38A3A5",
    },
  },
});
theme = responsiveFontSizes(theme);

/** CSS class generator */
const useStyles = makeStyles((theme) => ({
  // Body container to check body width based on sidebar width
  body: {
    flexGrow: 1,
    width: `calc(100% - ${sidebarSmall}px)`,
    "&.open": { width: `calc(100% - ${sidebarLarge}px)` },
  },
  // Wrapper to add a small padding to left to show sidebar over the content
  wrapper: {
    height: `calc(100vh - ${headerHeight}px)`,
    minHeight: `calc(100vh - ${headerHeight}px)`,
    overflow: "auto",
    position: 'relative',
    [theme.breakpoints.down("xs")]: { paddingLeft: sidebarSmall },
    backgroundColor: '#F4F4F4'
  },
}));

/** Configure Toast */
toast.configure({
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Flip,
});

/** Root Component */
function App() {
  const classes = useStyles();

  // State to get target node, to upate scroll event on header
  const [scrollTarget, setScrollTarget] = React.useState();
  const updateTarget = (target) => target && setScrollTarget(target);

  // State to save scrollbar open/close status
  const [isSidebarOpen, setSidebar] = React.useState(false);




  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" width="100vw" overflow="auto" ref={updateTarget}>
        <Router>
          <Switch>
            <Route path="/login" exact>
              <Auth title="LOGIN" />
            </Route>
            <Route path="/signup" exact>
              <Auth title="SIGNUP" />
            </Route>
            <Route path="/forgotpassword" exact>
              <Auth title="FORGOT PASSWORD" />
            </Route>
            <Route path="/resetpassword">
              <Auth title="RESET PASSWORD" />
            </Route>

            <ProtectedRoutes>
              <Box display="flex">
                <Box>
                  <Sidebar isOpen={isSidebarOpen} toggleSidebar={setSidebar} />
                </Box>

                <Box
                  flexGrow={1}
                  className={`${classes.body} ${isSidebarOpen ? "open" : ""}`}
                  data-test="body-wrapper"
                >
                  <Header scrollTarget={scrollTarget} />
                  <div className={classes.wrapper}>

                    <Route exact path="/">
                      <Home title="HOME" />
                    </Route>

                    <RestrictedRoutes>

                      <Route exact path="/verify">
                        <Verify title="VERIFY" />
                      </Route>
                      <Route exact path="/poam">
                        <Poam title="POA&M" />
                      </Route>
                      <Route exact path="/profile">
                        <Profile title="PROFILE" />
                      </Route>
                      <Route exact path="/Integrated-Platforms">
                        <Integrate title="Integrated Platforms" />
                      </Route>
                      <Route path="/vendor-management">
                        <VendorManagement title="Vendor Management" />
                      </Route>
                      <Route path="/risk-management">
                        <RiskManagement title="Risk Management" />
                      </Route>
                      <Route path="/access-management/">
                        <AccessManagement title="Access Management" />
                      </Route>
                      <Route path="/rbac/">
                        <Rbac title="Rbac" />
                      </Route>

                    </RestrictedRoutes>

                  </div>
                </Box>
              </Box>

              <ParamsRoutes params={["email"]}>
                <Email title="EMAIL" />
              </ParamsRoutes>

              <ParamsRoutes
                // Add rowId in params array, so when it is in the params, the CreateIssue component will mount.
                params={["createIssue", "rowIndex", "rowId"]}
                removeParams={["createIssue"]}
              >
                <CreateIssue title="Create Issue" />
              </ParamsRoutes>

              <ParamsRoutes params={["updateIssue", "issues"]}>
                <UpdateIssue title="Update Issue" />
              </ParamsRoutes>
            </ProtectedRoutes>
          </Switch>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
