import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";

function SkeletonBox({ text, ...rest }) {
  return (
    <Skeleton animation="wave" style={{ transform: "none" }} {...rest}>
      <Typography
        variant="h5"
        style={{
          visibility: "visible",
          color: "gray",
          fontWeight: "bold",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          letterSpacing: 2,
        }}
      >
        {text}
      </Typography>
    </Skeleton>
  );
}

export default SkeletonBox;
