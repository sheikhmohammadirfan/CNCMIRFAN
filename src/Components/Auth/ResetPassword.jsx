import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { checkPasswordReset, resetPassword } from "../../Service/UserFactory";
import CloseButton from "../Utils/CloseButton";
import { Form, PasswordControl } from "../Utils/Control";
import { isPasswordValid } from "../Utils/Control/Controls.utils";
import DialogBox from "../Utils/DialogBox";
import { notification } from "../Utils/Utils";

function ResetPassword({ path, onClose }) {
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
      open={true}
      fullWidth
      maxWidth="xs"
      bottomSeperator={true}
      title={
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Reset Password</span>
          <CloseButton click={onClose} />
        </Box>
      }
      titleProp={{ style: { padding: "8px 16px" } }}
      content={
        <Box paddingTop={1}>
          {checking ? (
            <Typography variant="h5">
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
                label="New Password"
                size="small"
                variant="standard"
                style={{ width: "70%" }}
              />
              <PasswordControl
                name="confirm_password"
                label="Confirm Password"
                size="small"
                variant="standard"
                forceHidden={true}
                style={{ width: "70%" }}
              />
            </Form>
          )}
        </Box>
      }
      actions={[
        <Button
          variant="outlined"
          style={{ marginRight: 8 }}
          onClick={handleSubmit(onSubmit)}
          endIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Reset
        </Button>,
      ]}
    />
  );
}

export default ResetPassword;
