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
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Verify from "./Pages/Verify";
import Home from "./Pages/Home";
import Poam from "./Pages/Poam";
import Email from "./Pages/Email";
import Jira from "./Pages/Jira";
import Profile from "./Pages/Profile";
import Integrate from "./Pages/Integrate";
import { useState } from "react";

const sidebarSmall = 50;
const sidebarLarge = 250;

/** Theme generator */
let theme = createTheme({
  sidebarSmall,
  sidebarLarge,
  textOnPrimary: "#ffffff",
  palette: {
    primary: {
      main: "#00A19D",
      dark: "#00A19D",
      light: "#FFF8E5",
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
  body: {
    flexGrow: 1,
    width: `calc(100% - ${sidebarSmall}px)`,
    "&.open": {
      width: `calc(100% - ${sidebarLarge}px)`,
    },
  },
  wrapper: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: sidebarSmall,
    },
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
  const [scrollTarget, setScrollTarget] = useState();
  const updateTarget = (target) => target && setScrollTarget(target);

  // State to save scrollbar status
  const [isSidebarOpen, setSidebar] = useState(false);

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

            <ProtectedRoutes>
              <Box display="flex">
                <Box>
                  <Sidebar isOpen={isSidebarOpen} toggleSidebar={setSidebar} />
                </Box>
                <Box
                  flexGrow={1}
                  className={`${classes.body} ${isSidebarOpen ? "open" : ""}`}
                >
                  <Header scrollTarget={scrollTarget} />
                  <div className={classes.wrapper}>
                    <Route exact path="/">
                      <Home title="HOME" />
                    </Route>
                    <Route exact path="/verify">
                      <Verify title="VERIFY" />
                    </Route>
                    <Route exact path="/support">
                      <Poam title="POAM Table" />
                    </Route>
                    <Route exact path="/email">
                      <Email title="EMAIL" />
                    </Route>
                    <Route exact path="/issue">
                      <Jira title="Jira" />
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
            </ProtectedRoutes>
          </Switch>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
