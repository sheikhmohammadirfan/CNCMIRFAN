import { Tabs, Tab, withStyles } from "@material-ui/core";

const FindingsTabs = ({ activeTab, handleChange }) => {
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
      <CustomTab label="Additional details" />
      <CustomTab label="Linked risk scenarios" />
    </Tabs>
  );
};

export default FindingsTabs;
