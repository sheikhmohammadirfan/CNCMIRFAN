import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import React from "react";

// Dialog component
function DialogBox({
  open,
  close,
  title,
  titleProp,
  content,
  contentProp,
  actions,
  actionProp,
}) {
  return (
    <Dialog open={open} onClose={close}>
      {title && <DialogTitle {...titleProp}>{title}</DialogTitle>}
      {content && <DialogContent {...contentProp}>{content}</DialogContent>}
      {actions && (
        <DialogActions disableSpacing>
          <Grid container justifyContent="flex-end" {...actionProp}>
            {actions.map((element, index) => (
              <Grid item key={index}>
                {element}
              </Grid>
            ))}
          </Grid>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default DialogBox;
