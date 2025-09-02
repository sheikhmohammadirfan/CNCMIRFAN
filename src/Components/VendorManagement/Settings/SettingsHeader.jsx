import {
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  withStyles,
} from "@material-ui/core";

const SettingsHeader = ({ activeTab, handleChange }) => {
  const CustomTab = withStyles({
    root: {
      textTransform: "none",
    },
  })(Tab);
  return (
    <Box>
      <Box p={2}>
        <Typography variant="h4">Settings</Typography>
      </Box>

      <Divider />
      <Box p={2}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
        >
          <CustomTab label="Security Questionnaires" />
          <CustomTab label="Falcon AI Templates" />
          <CustomTab label="Risk Score Formula" />
          <CustomTab label="Security Review Frequency" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default SettingsHeader;
