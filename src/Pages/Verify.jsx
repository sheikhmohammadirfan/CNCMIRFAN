import React from "react";
import { makeStyles } from "@material-ui/core";
import UploadPreview from "../Components/Upload";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

export default function Verify() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h2>You can upload your files here.</h2>
      <UploadPreview />
    </div>
  );
}
