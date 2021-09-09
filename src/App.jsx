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

/** Theme generator */
let themes = createTheme({
  sidebarSmall: 50,
  sidebarLarge: 250,
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
    }
  }
});
themes = responsiveFontSizes(themes);

/** CSS class generator */
const useStyles = makeStyles((theme) => ({
  body: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: themes.sidebarSmall,
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

  return (
    <ThemeProvider theme={themes}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login" exact >
            <Auth title="LOGIN" />
          </Route>
          <Route path="/signup" exact >
            <Auth title="SIGNUP" />
            </Route>

          <ProtectedRoutes>
            <Box display="flex">
              <Box>
                <Sidebar />
              </Box>
              <Box flexGrow={1}>
                <Header />
                <div className={classes.body}>
                  <Route exact path="/">
                    <Home title="HOME" />
                  </Route>
                  <Route exact path="/verify">
                    <Verify title="VERIFY" />
                  </Route>
                </div>
              </Box>
            </Box>
          </ProtectedRoutes>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
