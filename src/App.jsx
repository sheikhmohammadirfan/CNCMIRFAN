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
import React from "react";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

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
      main: "#008374",
      dark: "#008374",
      light: "#449487",
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
    minHeight: `calc(100vh - ${headerHeight}px)`,
    overflow: "auto",
    [theme.breakpoints.down("xs")]: { paddingLeft: sidebarSmall },
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
                    <Route exact path="/verify">
                      <Verify title="VERIFY" />
                    </Route>
                    <Route exact path="/poam">
                      <Poam title="POA&M" />
                    </Route>
                    <Route exact path="/profile">
                      <Profile title="PROFILE" />
                    </Route>
                    <Route exact path="/Integrated_Platforms">
                      <Integrate title="Integrated Platforms" />
                    </Route>
                  </div>
                </Box>
              </Box>

              <ParamsRoutes params={["email"]}>
                <Email title="EMAIL" />
              </ParamsRoutes>

              <ParamsRoutes
                params={["createIssue", "rowIndex"]}
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
