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
  loading = false,
  title,
  titleProp,
  content,
  contentProp,
  actions,
  actionProp,
  bottomSeperator = false,
  ...rest
}) {
  return (
    <Dialog open={open} onClose={close} scroll="paper" {...rest}>
      <DialogTitle {...titleProp}>{title}</DialogTitle>
      <DialogContent
        style={{ overflow: "hidden", padding: `${loading ? 4 : 0}px 0` }}
      >
        {loading && <LinearProgress />}
        {!loading && <Divider />}
      </DialogContent>
      {content && <DialogContent {...contentProp}>{content}</DialogContent>}
      {actions && (
        <>
          {bottomSeperator && <Divider />}
          <DialogActions disableSpacing>
            <Grid
              container
              spacing={1}
              justifyContent="flex-end"
              {...actionProp}
            >
              {actions.map((element, index) => (
                <Grid item key={index}>
                  {element}
                </Grid>
              ))}
            </Grid>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default DialogBox;
