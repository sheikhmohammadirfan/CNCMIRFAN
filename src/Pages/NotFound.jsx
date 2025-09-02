import React from "react";
import { Box, Typography } from "@material-ui/core";

export default function NotFound({ title = "404 - Not Found" }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Typography variant="h4" color="error">
        {title}
      </Typography>
    </Box>
  );
}
