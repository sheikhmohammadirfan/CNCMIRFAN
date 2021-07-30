import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  makeStyles,
} from "@material-ui/core";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

/**
 * Theme generator
 * */
const themes = createTheme({
  sidebarSmall: 50,
  sidebarLarge: 200,
  textOnPrimary: "#ffffff",
});

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

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={themes}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
