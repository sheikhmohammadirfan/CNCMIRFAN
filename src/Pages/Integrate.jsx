import React, { useState } from "react";
import { Grid, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { integratedPlatforms } from "../assets/data/dummyData";
// import { useLocalStorage } from "../Components/useLocalStorage";
import { getUser } from "../Service/UserFactory";
import DocumentTitle from "../Components/DocumentTitle";
import LinkJira from "../Components/Jira/LinkJira";

const useStyles = makeStyles((theme) => ({
  item: {
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #ccc",
    margin: theme.spacing(1),
    textAlign: "center",
    height: "100px",
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
  // const [user, setUser] = useLocalStorage("user");
  const user = getUser();
  // const userArray = Object.entries(user).map((entry) => ( { [entry[0]]: entry[1] } ))
  const userArray = [true, false, false, false, false];
  return (
    <Grid
      container
      style={{ flexGrow: "1", width: "100%", margin: "0" }}
      spacing={4}
    >
      {integratedPlatforms.map((platform, index) => (
        <Tooltip title={platform.name} key={index}>
          <Grid
            item
            xs
            key={index}
            className={
              userArray[index] === true
                ? `${classes.item}`
                : `${classes.item} ${classes.itemWithHover}`
            }
          >
            <img
              onClick={
                userArray[index] === true
                  ? null
                  : () => platform.onClick(setShow)
              }
              src={platform.image}
              alt={platform.name}
            />
          </Grid>
        </Tooltip>
      ))}
      {show === "Jira" && (
        <LinkJira openJira={show === "Jira"} closeJira={() => setShow("")} />
      )}
    </Grid>
  );
}
