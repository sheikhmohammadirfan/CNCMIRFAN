import {
  Avatar,
  Box,
  makeStyles,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";

/**
 * Styles generator
 * */
const useStyles = makeStyles((theme) => ({
  // style for header roots
  root: {
    minHeight: "min-content",
    color: theme.textOnPrimary,
    background: theme.palette.primary.light,
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    [theme.breakpoints.down("xs")]: {
      width: `calc(100% - ${theme.sidebarSmall}px)`,
      position: "fixed",
      left: theme.sidebarSmall,
    },
  },

  // Style for Avatar images
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
    <Box className={classes.root} boxShadow={headerScrollTrigger ? 3 : 0}>
      <Typography variant="h6">Header</Typography>
      <Box flexGrow={1}></Box>
      <Box display="flex" alignItems="center">
        <NotificationsIcon />
        <Avatar
          className={classes.avatar}
          alt="A"
          src="https://images.unsplash.com/photo-1625428508242-07166dc06bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ4MzIxNA&ixlib=rb-1.2.1&q=80&w=1080"
        />
      </Box>
    </Box>
  );
}

export default Header;
