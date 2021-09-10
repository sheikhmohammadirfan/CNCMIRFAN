import {
  Box,
  Button,
  Icon,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { TextControl } from "../Control";

// Generate CSS classes
const useStyles = makeStyles((theme) => ({
  // Root container responsble to show/hide section
  root: {
    background: theme.palette.background.paper,
    position: "absolute",
    right: 0,
    bottom: 2 * theme.spacing(7),
    zIndex: 3,
    width: "100%",
    height: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "all 0.3s linear",
    "&.active": {
      bottom: 0,
      width: "100%",
      height: "100%",
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      [theme.breakpoints.down("sm")]: { padding: theme.spacing(1) },
    },
  },

  // Styles for title
  title: {
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingRight: theme.spacing(1),
    borderBottom: `2px dashed ${theme.palette.secondary.dark}`,
  },

  // Style for password submit btn
  submitBtn: {
    background: `linear-gradient(to right , ${theme.palette.secondary.dark}, ${theme.palette.secondary.light})`,
    color: theme.textOnPrimary,
    fontWeight: "bold",
    letterSpacing: 2,
  },
}));

/** FORGOT PASSWORD COMPONENT */
function ForgotPassword({ show, login }) {
  // Get styles
  const classes = useStyles();

  return (
    <Box className={`${classes.root} ${show ? "active" : ""}`}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography className={classes.title}>Forgot Password</Typography>
        <IconButton onClick={login}>
          <Icon>cancel</Icon>
        </IconButton>
      </Box>
      
      <Box height={1} display="flex" flexDirection="column">
        <Box padding={1} flexGrow={1}>
          <TextControl fullWidth name="Email id to Recover" />
        </Box>
        <Box padding={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" className={classes.submitBtn}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
