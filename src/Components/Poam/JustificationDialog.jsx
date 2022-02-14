import { Button, Typography } from "@material-ui/core";
import React, { useRef } from "react";
import { useState } from "react";
import { TextControl } from "../Utils/Control";
import DialogBox from "../Utils/DialogBox";

/* JUSTIFICATION DIALOG COMPONENT */
function JustificationDialog({ onClose, onSubmit }) {
  // input referenct
  const ref = useRef();
  // error state
  const [error, setError] = useState(false);
  // loading state
  const [loading, setLoading] = useState(false);

  return (
    <DialogBox
      open={true}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      loading={loading}
      title={<Typography variant="h5">Justification</Typography>}
      titleProp={{ style: { padding: "16px" } }}
      content={
        <TextControl
          inputRef={ref}
          name=""
          variant="outlined"
          placeholder="Type here..."
          fullWidth
          multiline
          minRows={4}
          maxRows={100}
          gutter={false}
          error={error ? "This field cannot be empty." : ""}
        />
      }
      contentProp={{ style: { padding: "12px 12px 4px 12px" } }}
      actions={[
        <Button color="primary" variant="outlined" onClick={onClose}>
          CANCEL
        </Button>,
        <Button
          color="secondary"
          variant="contained"
          onClick={async () => {
            if (!ref.current.value) {
              setError(true);
              return;
            }
            setError(false);

            setLoading(true);
            await onSubmit(ref.current.value);
            setLoading(false);
            onClose();
          }}
        >
          Move
        </Button>,
      ]}
    />
  );
}

export default function JustificationDialogWrapper(props) {
  return props.isOpen ? <JustificationDialog {...props} /> : null;
}
