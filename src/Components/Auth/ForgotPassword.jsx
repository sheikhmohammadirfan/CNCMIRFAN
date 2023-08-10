import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Form, TextControl } from "../Utils/Control";
import CloseButton from "../Utils/CloseButton";
import { useForm } from "react-hook-form";
import { requestPasswordReset } from "../../Service/UserFactory";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { EMAIL_REGEX } from "../../assets/data/Other";
import { ArrowBack } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';


// Generate CSS classes
const useStyles = makeStyles((theme) => ({
  // Root container responsble to show/hide section
  root: {
    background: theme.palette.background.paper,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 3,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.3s linear",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.down("sm")]: { padding: theme.spacing(1) },
    "&.active": { opacity: 1, pointerEvents: "all" },
  },

  // Styles for title
  title: {
    fontWeight: "bold",
    textAlign: "center",
    // paddingRight: theme.spacing(1),
    fontSize: 20,
    margin: "17px auto",
    color: theme.palette.primary.main,
  },

  // Style for password submit btn
  submitBtn: {
    background: theme.palette.primary.main,
    color: theme.textOnPrimary,
    fontWeight: "bold",
    letterSpacing: 2,
    width: "100%",
    borderRadius: "10px",
  },
  //paragraph
  para: {
    color: "grey",
    textAlign: "center",
  },
  //back to login button
  login: {
    width: "70%",
    margin: "auto 18%",
    color: "grey",
    fontWeight: "bold",
  },
  //login button
  loginBtn: {
    color: "grey",
    fontWeight: "bold",
  },
}));

/** FORGOT PASSWORD COMPONENT */
export default function ForgotPassword({ show, login }) {
  // Get styles
  const classes = useStyles();

  const { control, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      const status = await requestPasswordReset(data);
      setLoading(false);
      if (status) {
        history.push("/login");
        reset({ email: "" });
      }
    }
  };

  return (
    <Box className={`${classes.root} ${show ? "active" : ""}`}>
      <Box textAlign="center">
        <Typography className={classes.title}>FORGOT PASSWORD ?</Typography>
        {/* <CloseButton
          click={() => {
            reset({ email: "" });
            login();
          }}
        /> */}
      </Box>
      <Typography variant="p" className={classes.para}>No worries, we will send you reset instructions</Typography>

      <Box height={1} display="flex" flexDirection="column">
        <Form
          control={control}
          autoComplete="off"
          rules={{
            email: {
              pattern: {
                value: EMAIL_REGEX,
                message: "Invalid email address.",
              },
              required: "Email is required.",
            },
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box padding={1} flexGrow={1}>
            <TextControl
              fullWidth
              label="Email id"
              name="email"
              variant="standard"
            />
          </Box>
          <Box padding={1}>
            <Button
              variant="contained"
              className={classes.submitBtn}
              type="submit"
              endIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              Submit
            </Button>
          </Box>
          <Box className={classes.login}>
            <Button variant="text" onClick={() => { reset({ email: "" }); login() }} className={classes.loginBtn}>
              <IconButton>
                <ArrowBack/>
              </IconButton>Back to login</Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
