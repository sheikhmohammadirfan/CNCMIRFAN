import { Box, makeStyles, useScrollTrigger } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

/**
 * CSS class generator
 * */
const useStyles = makeStyles((theme) => ({
  // style for header roots
  root: {
    zIndex: 5,
    minHeight: "min-content",
    background: "#ddd",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    transition: "box-shadow 0.1s linear",
    [theme.breakpoints.down("xs")]: {
      width: `calc(100% - ${theme.sidebarSmall}px)`,
      left: theme.sidebarSmall,
    },
  },
}));

/**
 * Header component
 * */
function Header({ scrollTarget }) {
  // Get styles
  const classes = useStyles();

  // Set onScroll handler, to activate bottom shadow when scroll from top
  const headerScrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: scrollTarget,
  });

  return (
    <>
      <Box className={classes.root} boxShadow={headerScrollTrigger ? 3 : 0}>
        <Breadcrumbs />
        <Box display="flex" alignItems="center">
          <NotificationsIcon style={{ cursor: "pointer" }} />
        </Box>
      </Box>
    </>
  );
}

export default Header;
