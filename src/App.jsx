import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  makeStyles,
  responsiveFontSizes,
  Link,
  CircularProgress,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
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
import React, { useEffect, useState } from "react";
import AccessManagement from "./Pages/AccessManagement";
import VendorManagement from "./Pages/VendorManagement";
import Rbac from "./Pages/Rbac";
import RestrictedRoutes from "./Components/Utils/Routers/RestrictedRoutes";
import DocCompliance from "./Pages/DocCompliance";
import { getUser } from "./Service/UserFactory";
import Organization from "./Components/Rbac/Organization/Organization";
import NotFound from "./Pages/NotFound";

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
    padding: "16px",
    position: "relative",
    [theme.breakpoints.down("xs")]: { paddingLeft: sidebarSmall },
    backgroundColor: "#F4F4F4",
  },
  // Loading container
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
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

  // State to get target node, to update scroll event on header
  const [scrollTarget, setScrollTarget] = React.useState();
  const updateTarget = (target) => target && setScrollTarget(target);

  // State to save scrollbar open/close status
  const [isSidebarOpen, setSidebar] = React.useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Initial user load
    const userData = getUser();
    console.log('Initial user data:', userData);
    setUser(userData);
    setIsLoading(false); // Set loading to false after user data is loaded

  // block added by irfan to listen for user updates
  const handleUserUpdate = (event) => {
    console.log('User updated event received:', event.detail); 
    const updatedUser = getUser();
    setUser(updatedUser);
  };

  // event listener for user updates-irfan
  window.addEventListener('userUpdated', handleUserUpdate);

  // cleanup function-irfan
  return () => {
    window.removeEventListener('userUpdated', handleUserUpdate);
  };

  }, []);
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" width="100vw" overflow="hidden" ref={updateTarget}>
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
              {isLoading ? (
                // Show loading spinner while user data is being fetched
                <Box className={classes.loadingContainer}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box display="flex">
                  <Box>
                  {/* Regular sidebar for all users - no need for custom sidebar logic */}
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
                      {/* Conditional redirect based on user role */}
                      {user?.is_superuser ? (
                        <Redirect to="/rbac/organization" />
                      ) : (
                        <Home title="HOME" />
                      )}
                    </Route>
                      {/* irfan: added user={user} */}
                      <RestrictedRoutes user={user}>
                       {user?.is_superuser ? (
                        <>
                          <Route exact path="/rbac/organization">
                            <Organization title="ORGANIZATION" />
                          </Route>
                          <Route exact path="/profile">
                            <Profile title="PROFILE" />
                          </Route>
                        </>
                      ) : (
                          <>
                          {/* route added by irfan to block normal users from accessing organization page */}
                          <Route exact path="/rbac/organization">
                              <NotFound />
                            </Route>
                            
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
                            <Route path="/doc-compliance/">
                              <DocCompliance title="Document Compliance" />
                            </Route>
                          </>
                        )}
                      </RestrictedRoutes>
                    </div>
                  </Box>
                </Box>
              )}

              <ParamsRoutes params={["email"]}>
                <Email title="EMAIL" />
              </ParamsRoutes>

              <ParamsRoutes
                params={["createIssue", "rowIndex", "rowId"]}
                removeParams={["createIssue"]}
              >
                <CreateIssue title="Create Issue" />
              </ParamsRoutes>

              <ParamsRoutes params={["updateIssue", "issues"]}>
                <UpdateIssue title="Update Issue" />
              </ParamsRoutes>
              {/* route added by irfan to show 404 page for undefined routes */}
            </ProtectedRoutes>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;