import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
} from "@material-ui/core";
import React from "react";

// Dialog component
function DialogBox({
  open,
  close,
  loading,
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
      {loading === true && <LinearProgress />}
      {loading === false && <Divider />}
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
