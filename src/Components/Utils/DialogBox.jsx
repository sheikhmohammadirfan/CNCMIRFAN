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

/* Dialog component */
export default function DialogBox({
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
    <Dialog
      open={open}
      onClose={close}
      scroll="paper"
      container={() =>
        document.getElementById(localStorage.getItem("fullScreen"))
      }
      {...rest}
    >
      <DialogTitle {...titleProp}>{title}</DialogTitle>

      <DialogContent style={{ overflow: "hidden", padding: 0 }}>
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
              alignItems="center"
              justifyContent="flex-end"
              {...actionProp}
            >
              {actions.map((element, index) => (
                <Grid item key={index} {...element.prop}>
                  {element.element ? element.element : element}
                </Grid>
              ))}
            </Grid>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
