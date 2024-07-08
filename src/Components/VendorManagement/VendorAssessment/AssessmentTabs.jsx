import { Box, Tabs, Tab, withStyles } from "@material-ui/core";

const AssessmentTabs = ({ activeTab, handleChange }) => {
	const CustomTab = withStyles({
    root: {
      textTransform: "none",
    },
  })(Tab);
  return (
    <Tabs
      value={activeTab}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
    >
      <CustomTab label="Active" />
      <CustomTab label="Archived" />
    </Tabs>
  );
};

export default AssessmentTabs;
