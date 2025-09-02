import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { FileDrop } from "react-file-drop";
import DialogBox from "../../DialogBox";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// Generate styles
const useStyles = makeStyles((theme) => ({
  // Make filedrop match to parent
  fileDrop: { height: "100%" },
  fileDropTarget: { height: "100%" },

  // Drop child root
  root: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.1s linear",
    border: "1px solid white",
    cursor: "pointer",
    // When file drag is on
    "&[frame-drag=true]": {
      background: "rgba(155, 155, 205, 0.2)",
      // Pulse, when darg is outside of target
      "&[target-drag=false]": { "--color": "55, 55, 100" },
    },
    // Show border, when darg is on target
    "&[target-drag=true]": { borderColor: "rgb(155, 155, 205)" },
  },

  // Label style
  label: {
    fontWeight: "bold",
    pointerEvents: "none",
    color: theme.palette.grey[600],
  },
}));

// Method to render content inside of file drop box
const DragContent = (isDragActive, isDragAbove) => {
  // Get styles
  const classes = useStyles();

  // Get labels based on drag status
  const getLabel = () => {
    if (isDragAbove) return "Drop it.";
    if (isDragActive) return "Drag here !";
    return "Drag n Drop";
  };

  return (
    <Box padding={1} width={1} height={1} data-test="drag-n-drop-target">
      <Box
        className={`${classes.root} pulse`}
        frame-drag={String(isDragActive)}
        target-drag={String(isDragAbove)}
      >
        <Typography className={classes.label}>{getLabel()}</Typography>
      </Box>
    </Box>
  );
};

// Method to render drag-n-drop inside a dialog / show drag-n-drop in given function or container reference
const RenderDragNDrop = ({
  trigger,
  onChange,
  dialogOpen,
  closeDrag,
  containerRef,
  container,
  content,
}) => {
  // get styles
  const classes = useStyles();

  // React hooks to save drag status
  const [isDragActive, setDragActive] = useState(false);
  const [isDragAbove, setDragAbove] = useState(false);
  // Reset drag
  const resetState = () => {
    setDragActive(false);
    setDragAbove(false);
  };

  // Wrap content inside drag-n-drop event listener
  const FileDropElement = (
    <FileDrop
      className={classes.fileDrop}
      targetClassName={classes.fileDropTarget}
      onTargetClick={() => trigger() & closeDrag()}
      onFrameDragEnter={() => setDragActive(true)}
      onFrameDragLeave={() => setDragActive(false)}
      onFrameDrop={() => resetState() & closeDrag()}
      onDragOver={() => setDragAbove(true)}
      onDragLeave={() => setDragAbove(false)}
      onDrop={(files) => resetState() & onChange(files) & closeDrag()}
      data-test="drag-n-drop-fileDrop"
    >
      {(content || DragContent)(isDragActive, isDragAbove)}
    </FileDrop>
  );

  // if container reference is passed the mount component there.
  useEffect(() => {
    if (containerRef) {
      ReactDOM.render(FileDropElement, containerRef.current);
      return () => ReactDOM.unmountComponentAtNode(containerRef.current);
    }
  }, [containerRef, isDragActive, isDragAbove]);

  // If container ref is passed, then return null
  if (containerRef) return null;

  return container ? (
    container(FileDropElement)
  ) : (
    <DialogBox
      open={dialogOpen}
      close={closeDrag}
      maxWidth="xs"
      fullWidth
      titleProp={{ style: { padding: 0 } }}
      content={
        <Box width={1} height="40vh">
          {FileDropElement}
        </Box>
      }
      data-test="drag-n-drop-dialog-box"
    />
  );
};

const PropTypes_Conditional = (props, propName, componentName) => {
  if (props["containerRef"] || props["container"]) return;

  if (props[propName] === undefined)
    return new Error(`${propName} props is required.`);

  if (propName === "dialogOpen" && typeof props[propName] !== "boolean")
    return new Error(`Invalid ${propName} props is passed.`);
  if (propName === "closeDrag" && typeof props[propName] !== "function")
    return new Error(`Invalid ${propName} props is passed.`);
};

RenderDragNDrop.propTypes = {
  trigger: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  dialogOpen: PropTypes_Conditional,
  closeDrag: PropTypes_Conditional,
};

export { RenderDragNDrop };
