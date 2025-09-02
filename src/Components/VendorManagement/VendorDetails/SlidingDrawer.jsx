import React, { useState } from "react";
import {
  Drawer,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@material-ui/core";
import TabPanel from "../TabPanel";
import FindingsTabs from "./FindingsTabs";
import AdditionalDetailsTab from "./AdditionalDetailsTab";
import LinkedRiskScenariosTab from "./LinkedRiskScenariosTab";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    width: 640,
    padding: theme.spacing(2),
  },
  closeIcon: {
    display: "flex",
    justifyContent: "flex-end",
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  addFindingInput: {
    width: "600px",
    height: "130px",
    overflow: "auto",
    backgroundColor: "white",
    borderRadius: 7,
    padding: 8,
  },
}));

const SlidingDrawer = ({ isDrawerOpen, setIsDrawerOpen, findingDetails }) => {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Drawer
        BackdropProps={{ invisible: true }}
        elevation={2}
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box className={classes.drawerContent}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" className={classes.section}>
              Manage Finding
            </Typography>
            <Box className={classes.closeIcon}>
              <IconButton onClick={() => setIsDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body1" className={classes.section}>
            View details about the finding and ensure the associated risk is
            mitigated.
          </Typography>
          <Typography variant="subtitle1" mt={2} className={classes.section}>
            Finding
          </Typography>
          <TextField
            variant="outlined"
            value={findingDetails.description}
            //onChange={(e) => setNewFinding(e.target.value)}
            className={classes.addFindingInput}
            multiline
            rows={4}
          />
          <FindingsTabs activeTab={activeTab} handleChange={handleChange} />
          <TabPanel activeTab={activeTab} index={0}>
            <AdditionalDetailsTab findingDetails={findingDetails} />
          </TabPanel>
          <TabPanel activeTab={activeTab} index={1}>
            <LinkedRiskScenariosTab />
          </TabPanel>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SlidingDrawer;
