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
import { userData } from "./assets/dummyData";
import Chart from "./Components/Chart";
import { useLayoutEffect, useState } from "react";
import Verify from "./Pages/Verify";

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

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

function App() {
  const classes = useStyles();
  const [width] = useWindowSize();
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
                <Route exact path="/">
                  <Box className={classes.rightSide}>
                    <div className={classes.body}>
                      <Chart
                        data={width > 800 ? userData : userData.slice(0, 4)}
                        title="Analytics"
                        grid
                        dataKey="Active User"
                      />
                    </div>
                  </Box>
                </Route>
                <Route exact path="/verify">
                  <Verify />
                </Route>
              </Box>
            </Box>
          </ProtectedRoutes>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
