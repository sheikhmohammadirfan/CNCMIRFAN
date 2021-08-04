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
import Sidebar from "./Components/Sidebar";
import Auth from "./Pages/Auth";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./Components/ProtectedRoutes";

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
  rightSide: {
    wordBreak: "break-word",
  },
  body: {
    [theme.breakpoints.down("xs")]: {
      paddingTop: 56,
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
                <Box className={classes.rightSide}>
                  <Header />
                  <div className={classes.body}>
                    ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem duvloremduvloremdu ccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremccc
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvloremccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremccc
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvloremccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremccc
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvloremccc duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremccc
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                    duvloremduvloremduvloremduvloremduvloremduvloremduvloremduvloremduvlorem
                    duvlorem
                  </div>
                </Box>
              </Box>
            </Box>
          </ProtectedRoutes>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
