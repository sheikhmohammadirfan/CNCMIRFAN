import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useForm } from "react-hook-form";
import { checkPasswordReset, resetPassword } from "../../Service/UserFactory";
import { Form, PasswordControl } from "../Utils/Control";
import { isPasswordValid } from "../Utils/Control/Controls.utils";
import DialogBox from "../Utils/DialogBox";
import { notification } from "../Utils/Utils";


// Styling
const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 25,
    color: theme.palette.primary.main,
    textAlign:"center",
  },

  subText: {
    color:theme.palette.primary.light,
    fontSize: 14,
  },

  dialogBox: {
    "& .MuiTypography-h6 ":{
      padding: "12px 30px",
    },

    "& .MuiGrid-spacing-xs-1 > .MuiGrid-item":{
      padding:"0",
    },

    "& .MuiGrid-spacing-xs-1":{
      margin:"0",
    },

    "& .MuiDivider-root": {
      border: "none",
      height: "0",
    },
    "& .MuiDialog-paperWidthXs": {
      maxWidth: "350px",
      
    },

    "& .MuiGrid-justify-content-xs-flex-end":{
      display:"flex",
      width:"100%",
      justifyContent:"normal"
    },

    "& .MuiDialogActions-root":{
      padding:"12px 30px 30px"
    },

    "& .MuiGrid-spacing-xs-1 > .MuiGrid-item ":{
      width:"100% !important"
    },

    "& .MuiDialogContent-root":{
      padding:"12px 30px"
    }

  },

  formPara: {
    color:theme.palette.primary.light,
  },

  resetBtn: {
    width:"100%",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 1 * theme.shape.borderRadius,
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  
  progress: {
    // Define any additional styles for the CircularProgress component
    color: theme.palette.primary.main, // Set the color using the primary color from the theme
  },

}));


function ResetPassword({ path, onClose }) {

  const classes = useStyles();

  const pathArray = path.substring(1).split("/");

  const { control, handleSubmit, getValues } = useForm({
    password: "",
    confirm_password: "",
  });

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
 
  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      const formData = {
        password: data.password,
        uidb64: pathArray[1],
        token: pathArray[2],
      };
      const status = await resetPassword(formData);
      setLoading(false);
      if (status) onClose();
    }
  };

  if (pathArray.length !== 3 || !pathArray.every((p) => Boolean(p))) {
    notification("login", "Invalid Link!", "error");
    onClose();
  }

  useEffect(() => {
    (async () => {
      const status = await checkPasswordReset({
        uidb64: pathArray[1],
        token: pathArray[2],
      });
      if (status) setChecking(false);
      else onClose();
    })();
  }, []);

  return (
    <DialogBox
      className={classes.dialogBox}
      open={true}
      maxWidth="xs"
      bottomSeperator={false}
      title={
        <>
          <Box className={classes.title}>
            <span>Reset Password</span>
          </Box>
          <Box className={classes.subText}>
            <p>Your new password should be different from previous used password.</p>
          </Box>
        </>
      }
      titleProp={{ style: { padding: "0" } }}
      content={
        <Box>
          {checking ? (
            <Typography variant="h6" className={classes.progress}>
              Verifing Link ... <CircularProgress size={25} className={classes.progress} />
            </Typography>
          ) : (
            <Form
              control={control}
              rules={{
                password: {
                  validate: { invalid: isPasswordValid },
                  required: "New Password is required.",
                },
                confirm_password: {
                  validate: {
                    invalid: (pass) =>
                      pass === getValues("password") ||
                      "Password do not match.",
                  },
                },
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <PasswordControl
                name="password"
                size="small"
                variant="standard"
                label="New password"
                style={{ width: "100%" }}
              />
              <PasswordControl
                name="confirm_password"
                size="small"
                variant="standard"
                label="Confirm password"
                style={{ width: "100%" }}
                forceHidden={true}
              />
              <Typography variant="body2" className={classes.formPara}>
                Passwords must match
              </Typography>
            </Form>
          )}
        </Box>
      }
      actions={[
        <Button
          className={classes.resetBtn}
          onClick={handleSubmit(onSubmit)}
          endIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Reset Password
        </Button>,
      ]}
    />
  );
}

export default ResetPassword;
