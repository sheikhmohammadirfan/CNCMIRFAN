import { Tabs, Tab, withStyles } from "@material-ui/core";

const VendorTabs = ({ activeTab, handleChange }) => {
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
    >
      <CustomTab label="Info" />
      <CustomTab label="Findings" />
    </Tabs>
  );
};

export default VendorTabs;
