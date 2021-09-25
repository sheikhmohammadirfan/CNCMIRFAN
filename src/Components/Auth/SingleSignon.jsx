import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import aws from "../../assets/img/sso/aws.svg";
import cloud from "../../assets/img/sso/gcp.svg";
import github from "../../assets/img/sso/github.svg";
import google from "../../assets/img/sso/google.svg";
import heroku from "../../assets/img/sso/heroku.svg";

/** CSS class generator */
const useStyles = makeStyles((theme) => ({
  // Update tooltip background & padding
  tooltip: {
    background: theme.palette.secondary.main,
    padding: `${theme.spacing(1 / 8)}px ${theme.spacing(1)}px`,
  },
  // Update tooltip arrow
  arrow: { color: theme.palette.secondary.main },
}));

/** Flex row with Single Signon options */
function SingleSignon() {
  // Organize data
  const sso = [
    ["aws", aws],
    ["GCP", cloud],
    ["Github", github],
    ["Google", google],
    ["Heroku", heroku],
  ];

  // Get styles
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      marginBottom={1}
    >
      {sso.map(([title, src], index) => (
        <Tooltip
          key={index}
          title={<Typography variant="caption">{title}</Typography>}
          placement="top"
          arrow
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <IconButton style={{ padding: 4 }}>
            <Avatar src={src} alt={title} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}

export default SingleSignon;
