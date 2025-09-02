import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import DialogBox from "../../Utils/DialogBox";

const DeleteConfirmationDialog = ({ open, closeHandler, deleteAction }) => {
  const [isLoading, setisLoading] = useState(false);

  const confirmDelete = async () => {
    setisLoading(true);
    await deleteAction();
    setisLoading(false);
  };

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography style={{ fontWeight: "bold" }}>Confirm Delete</Typography>
      }
      loading={isLoading}
      content={
        <Typography>
          Are you sure you want to delete this action? This is irreversible!
        </Typography>
      }
      actions={[
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={closeHandler}
          disabled={isLoading}
        >
          Cancel
        </Button>,
        <Button
          variant="contained"
          color="primary"
          size="small"
          form="add-action-form"
          type="submit"
          disabled={isLoading}
          onClick={confirmDelete}
        >
          Delete
        </Button>,
      ]}
    ></DialogBox>
  );
};

export default DeleteConfirmationDialog;
