import React, { useState } from "react";
import {
  Icon,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FormProvider, useForm } from "react-hook-form";
import FormTextInput from "../Form/FormTextInput";
import { linkWithJira } from "../../Service/Jira.service";
import { toast } from "react-toastify";

const defaultValues = {
  link: "",
  email: "",
  api_token: "",
};

export default function LinkJira({ openJira, closeJira }) {
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, control } = methods;
  const [loader, setLoader] = useState(false);

  const notification = (msg, type) => {
    toast(msg, { type, toastId: "upload-toast", position: "top-center" });
  };

  const linkJira = (data) => {
    setLoader(true);
    linkWithJira(data.link, data.email, data.api_token)
      .then(() => {
        setLoader(false);
        closeJira();
      })
      .catch((err) => notification(err, "error"));
  };

  return (
    <Dialog open={openJira} onClose={closeJira} style={{ zIndex: "99" }}>
      <DialogTitle
        disableTypography
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Link Jira with Cncm</h2>
        <IconButton onClick={closeJira}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
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
  );
}
