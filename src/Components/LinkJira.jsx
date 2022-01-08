import React, { useState } from "react";
import {
  Box,
  Chip,
  Icon,
  TextField,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm } from "react-hook-form";
import FormTextInput from "../Components/Form/FormTextInput";
import { linkWithJira } from "../Service/Jira.service";
import { toast } from "react-toastify";

const defaultValues = {
  link: "",
  email: "",
  api_token: "",
};

export default function LinkJira() {
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, register, control } = methods;
  const [openJira, setOpenJira] = useState(false);
  const [loader, setLoader] = useState(false);

  const jiraDialogOpen = () => {
    setOpenJira(true);
  };

  const notification = (msg, type) => {
    toast(msg, { type, toastId: "upload-toast", position: "top-center" });
  };

  const linkJira = (data) => {
    setLoader(true);
    linkWithJira(data.link, data.email, data.api_token)
      .then(() => {
        setLoader(false);
        setOpenJira(false);
        reset();
      })
      .catch((err) => notification(err, "error"));
  };

  const closeJira = () => {
    setOpenJira(false);
    reset();
  };

  return (
    <Box component="div">
      <Button variant="contained" color="primary" onClick={jiraDialogOpen}>
        Link with jira
      </Button>
      <Dialog open={openJira} onClose={closeJira} style={{ zIndex: "99" }}>
        <DialogTitle>Link Jira with Cncm</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <FormTextInput
              name="link"
              control={control}
              label="Link"
              required={true}
            />
            <FormTextInput
              name="email"
              control={control}
              label="Email"
              required={true}
            />
            <FormTextInput
              name="api_token"
              control={control}
              label="Token"
              required={true}
            />
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeJira} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleSubmit(linkJira)}
            variant="contained"
          >
            Link
            {loader ? (
              <CircularProgress
                size={20}
                style={{ color: "#fff", marginLeft: "6px" }}
              />
            ) : (
              <Icon style={{ marginLeft: "4px", fontSize: "18px" }}>link</Icon>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
