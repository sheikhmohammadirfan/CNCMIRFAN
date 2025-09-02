import { Tabs, Tab, Box, withStyles } from "@material-ui/core";

const VendorTabs = ({ activeTab, handleChange }) => {
  const CustomTab = withStyles({
    root: {
      textTransform: "none",
    },
  })(Tab);
  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        <CustomTab label="Overview" />
        <CustomTab label="Security Review" />
        <CustomTab label="References" />
        <CustomTab label="Linked Apps" />
      </Tabs>
    </Box>
  );
};

export default VendorTabs;
