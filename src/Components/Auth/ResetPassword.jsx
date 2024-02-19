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
    marginBottom: 0,
  },
  subText: {
    color: "#808080",
    fontSize: 14,
  },
  dialogBox: {
    "& .MuiDivider-root": {
      border: "none",
      height: "0",
    },
    "& .MuiDialog-paperWidthXs": {
      maxWidth: "350px",
    },
    "& .MuiInputBase-root": {
      marginBottom: 0,
    },
    "&  .MuiTypography-h6":{
      margin: "10px 10px",
    },
    "& .MuiInputBase-root":{
      borderRadius: "50px",
    }
  },
  formPara: {
    color: "grey",
  },
  resetBtn: {
    marginRight: 8, 
    textTransform: "lowercase", 
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 10,
    marginBottom: 15,
    "&:hover": {
      background: theme.palette.primary.light,
    },
  }

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
            <span>Create new password</span>
          </Box>
          <Box className={classes.subText}>
            <p>Your new password should be different from previous used password.</p>
          </Box>
        </>
      }
      titleProp={{ style: { padding: "8px 16px" } }}
      content={
        <Box>
          {checking ? (
            <Typography variant="h6">
              Verifing Link ... <CircularProgress size={25} color="inherit" />
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
                variant="outlined"
                label="New password"
                style={{ width: "90%" }}
              />
              <PasswordControl
                name="confirm_password"
                size="small"
                variant="outlined"
                label="Confirm password"
                style={{ width: "90%" }}
                forceHidden={true}
              />
              <Typography variant="body2" className={classes.formPara}>
                <i>Both passwords must match</i>
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
          Reset password
        </Button>,
      ]}
    />
  );
}

export default ResetPassword;
