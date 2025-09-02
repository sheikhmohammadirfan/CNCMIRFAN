import React from "react";
import { Box, Typography, Button, Icon } from "@mui/material";
import PrivacyTipOutlined from "@mui/icons-material/PrivacyTipOutlined";

const LinkedRiskScenariosTab = () => {
  return (
    <Box p={4} textAlign="center" mt={2}>
      <Icon fontSize="large" color="primary">
        <PrivacyTipOutlined fontSize="large" />
      </Icon>
      <Typography variant="h6" mt={2}>
        No linked risks
      </Typography>
      <Typography
        mb={3}
        variant="body2"
        mt={2}
      >
        Link this finding to your risk register for additional visibility.
      </Typography>
      <Button variant="contained" sx={{ textTransform: "none" }}>
        Manage links
      </Button>
    </Box>
  );
};

export default LinkedRiskScenariosTab;
