import React from "react";
import { Grid, Tooltip, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { integratedPlatforms } from "../assets/data/dummyData";
import DocumentTitle from "../Components/DocumentTitle";

const useStyles = makeStyles((theme) => ({
  item: {
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #ccc",
    margin: theme.spacing(1),
    textAlign: "center",
    filter: "grayscale(1)",
    opacity: "0.6",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    "&:hover": {
      filter: "grayscale(0)",
      border: "1px solid #444",
      opacity: "1",
    },
  },
}));

export default function Integrate({ title }) {
  DocumentTitle(title);
  const classes = useStyles();
  return (
    <Grid
      container
      style={{ flexGrow: "1", width: "100%", margin: "0" }}
      spacing={2}
    >
      {integratedPlatforms.map((platform, index) => (
        <Tooltip title={platform.name} key={index}>
          <Grid item xs key={index} className={classes.item}>
            <img
              style={{
                padding: "0.4rem 0.8rem",
                width: "100%",
                height: "100%",
              }}
              src={platform.image}
              alt={platform.name}
            />
          </Grid>
        </Tooltip>
      ))}
    </Grid>
  );
}
