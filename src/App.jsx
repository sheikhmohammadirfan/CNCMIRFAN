import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  makeStyles,
  responsiveFontSizes,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Auth from "./Pages/Auth";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Verify from "./Pages/Verify";
import Home from "./Components/Home";

/**
 * Theme generator
 * */
let themes = createTheme({
  sidebarSmall: 50,
  sidebarLarge: 250,
  textOnPrimary: "#ffffff",
});
themes = responsiveFontSizes(themes);

/**
 * Styles generator
 * */
const useStyles = makeStyles((theme) => ({
  body: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: themes.sidebarSmall,
    },
  },
}));

toast.configure({
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});


function App() {
  const classes = useStyles();
  
  return (
    <ThemeProvider theme={themes}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login" component={Auth} exact />
          <Route path="/signup" component={Auth} exact />

          <ProtectedRoutes>
            <Box display="flex">
              <Box>
                <Sidebar />
              </Box>
              <Box flexGrow={1}>
                <Header />
                <div className={classes.body}>
                  <Route exact path="/">
                    <Home title="HOME"/>
                  </Route>
                  <Route exact path="/verify">
                    <Verify title="VERIFY"/>
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
