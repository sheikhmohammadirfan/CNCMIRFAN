import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  detailedViewContainer: {
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  content: {
    lineHeight: 1.6,
  },
}));

const DetailedReview = ({ title, content }) => {
  const classes = useStyle();

  return (
    <Box className={classes.detailedViewContainer}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.content}>
        {content}
      </Typography>
    </Box>
  );
};

export default DetailedReview;
