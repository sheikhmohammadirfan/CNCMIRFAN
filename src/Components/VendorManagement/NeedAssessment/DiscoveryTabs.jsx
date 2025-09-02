import { Tabs, Tab, withStyles } from "@material-ui/core";

const DiscoveryTabs = ({ activeTab, handleChange }) => {
  
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
      <CustomTab label="Needs Review" />
      <CustomTab label="Ignored" />
      <CustomTab label="Rejected" />
    </Tabs>
  );
};

export default DiscoveryTabs;
