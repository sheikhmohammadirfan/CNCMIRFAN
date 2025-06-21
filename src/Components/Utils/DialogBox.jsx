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
import PropTypes from "prop-types";
import { PropType_Component } from "./Utils";

/* Dialog component */
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
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (
          loading &&
          (reason === "backdropClick" || reason === "escapeKeyDown") // check if the dailoque is in loading state
        ) {
          return;
        }
        close(event, reason); //  original close handler
      }}
      scroll="paper"
      container={() =>
        document.getElementById(localStorage.getItem("fullScreen"))
      }
      {...rest}
      data-test="dialogbox-container"
    >
      <DialogTitle {...titleProp} data-test="dialogbox-title">
        {title}
      </DialogTitle>

      <DialogContent style={{ overflow: "hidden", padding: 0 }}>
        {loading && <LinearProgress data-test="dialogbox-loader" />}
        {!loading && <Divider data-test="dialogbox-divider" />}
      </DialogContent>

      {content && (
        <DialogContent {...contentProp} data-test="dialogbox-content">
          {content}
        </DialogContent>
      )}

      {actions && (
        <>
          {bottomSeperator && <Divider data-test="dialogbox-bottom-divider" />}

          <DialogActions disableSpacing>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
              {...actionProp}
            >
              {actions.map((element, index) => (
                <Grid
                  item
                  key={index}
                  {...element.prop}
                  data-test="dialogbox-actions-btn"
                >
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
DialogBox.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  title: PropType_Component,
  titleProp: PropTypes.object,
  content: PropType_Component,
  contentProp: PropTypes.object,
  actions: PropTypes.arrayOf(PropType_Component),
  actionProp: PropTypes.object,
  bottomSeperator: PropTypes.bool,
};

export default DialogBox;
