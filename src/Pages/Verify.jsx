import React from "react";
import { makeStyles } from "@material-ui/core";
import UploadPreview from "../Components/Upload";
import DocumentTitle from "../Components/DocumentTitle";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
  },
});

export default function Verify(props) {
  const classes = useStyles();
  DocumentTitle(`CNCM | ${props.title}`)
  return (
    <div className={classes.container}>
      <h2>You can upload your files here.</h2>
      <UploadPreview />
    </div>
  );
}
