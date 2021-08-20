import {
  Box,
  makeStyles,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Styles generator
 * */
const useStyles = makeStyles((theme) => ({
  // style for header roots
  root: {
    zIndex: 99,
    minHeight: "min-content",
    background: "#ddd",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    [theme.breakpoints.down("xs")]: {
      width: `calc(100% - ${theme.sidebarSmall}px)`,
      // position: "fixed",
      left: theme.sidebarSmall,
    },
  },
}));

/**
 * Header component
 * */
function Header() {
  // Get styles
  const classes = useStyles();

  // Set onScroll handler, to activate bottom shadow when scroll from top
  const headerScrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <>
      <Box className={classes.root} boxShadow={headerScrollTrigger ? 3 : 0}>
        <Breadcrumbs />
        <Typography>{}</Typography>
        <Box display="flex" alignItems="center">
          <NotificationsIcon style={{ cursor: "pointer" }} />
        </Box>
      </Box>
    </>
  );
}

export default Header;
