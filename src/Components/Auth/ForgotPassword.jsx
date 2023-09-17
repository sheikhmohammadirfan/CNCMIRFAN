import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Form, TextControl } from "../Utils/Control";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { requestPasswordReset } from "../../Service/UserFactory";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { EMAIL_REGEX } from "../../assets/data/Other";

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
    fontSize: 22,
    marginTop: "25px",
    marginBottom: "17px",
    color: theme.palette.primary.main,
  },

  // Style for password submit btn
  submitBtn: {
    background: theme.palette.primary.main,
    color: theme.textOnPrimary,
    borderRadius: "10px",
    marginLeft: 8,
    width: 70,
    padding: "5px 40px",
    textTransform: "lowercase",
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },

  //description
  subText: {
    color: "grey",
    fontSize: 15.4,
    marginBottom: 30,
  },

  //Return back to login
  backToLogin: {
    width: "70%",
    margin: "20px auto",
    color: "grey",
    fontSize: 16,
  },
  //Textfield and button alignment
  fieldAndButton: {
    display: "flex",
    marginTop: 14,
  },
  //Back to sign in page link
  signInLinkStyle: {
    textDecoration: "none",
    color: theme.palette.primary.main,
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
      <Box>
        <Typography className={classes.title}>FORGOT PASSWORD</Typography>
      </Box>
      <Typography variant="p" className={classes.subText}>Enter the email address associated with your account and we will send you an email to reset your password</Typography>

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
          <Box className={classes.fieldAndButton}>
            <TextControl
              type="email"
              name="email"
              size="small"
              variant="outlined"
              label="Email Id"
              data-test="login-email-field"
              fullWidth id="fullWidth"
              sx={{ borderRadius: "20px" }}
            />
            <Box>
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
          </Box>
          <Box className={classes.backToLogin}>
            <b>Want to login again?</b>
            <Link to="/login" className={classes.signInLinkStyle} onClick={() => { reset({ email: "" }); login() }}>
              <Typography variant="p"> <b>Sign in</b></Typography>
            </Link>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
