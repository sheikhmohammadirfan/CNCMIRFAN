import { Box } from "@mui/material";

const TabPanel = (props) => {
  const { children, activeTab, index } = props;

  return (
    <div hidden={activeTab !== index}>
      {activeTab === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;
