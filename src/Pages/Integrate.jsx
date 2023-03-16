import React, { useState } from "react";
import { Box, Grid, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { integratedPlatforms } from "../assets/data/dummyData";
import { getIntegratedPlatform } from "../Service/UserFactory";
import DocumentTitle from "../Components/DocumentTitle";
import LinkJira from "../Components/Jira/LinkJira";

/* Create styles */
const useStyles = makeStyles((theme) => ({
  item: {
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #ccc",
    textAlign: "center",
    height: "100px",
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemWithHover: {
    filter: "grayscale(1)",
    transition: "all 0.3s",
    opacity: "0.6",
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
  const [show, setShow] = useState("");

  const platforms = getIntegratedPlatform();

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {integratedPlatforms.map((platform, index) => (
          <Tooltip title={platform.name} key={index}>
            <Grid item xs={6} md={4} lg={3} key={index}>
              <Box
                className={
                  platforms[platform.name.toLowerCase()] === true
                    ? `${classes.item}`
                    : `${classes.item} ${classes.itemWithHover}`
                }
              >
                <img
                  onClick={
                    platforms[platform.name.toLowerCase()] === true
                      ? () => {}
                      : () => platform.onClick(setShow)
                  }
                  src={platform.image}
                  alt={platform.name}
                  height="100%"
                />
              </Box>
            </Grid>
          </Tooltip>
        ))}
        {show === "Jira" && (
          <LinkJira openJira={show === "Jira"} closeJira={() => setShow("")} />
        )}
      </Grid>
    </Box>
  );
}
