import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  Icon,
  Button,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Overview from "./Overview";
import SecurityReviewTab from "./SecurityReviewTab";
import References from "./References";
import LinkedApps from "./LinkedApps";
import VendorTabs from "./VendorTabs";
import OverviewTabs from "./OverviewTabs";
import TabPanel from "../TabPanel";
import Info from "./Info";
import Findings from "./Findings";
import {
  getReviewFindings,
  getReviewReferences,
} from "../../../Service/VendorManagement/Review.service";
import { useStyle } from "../Utils";

const VendorDetails = ({ isLoading, vendorList }) => {
  const classes = useStyle();
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState(0);
  const [findingsRows, setFindingsRows] = useState([]);
  const [referencesRows, setReferencesRows] = useState([]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const detailsChange = (event, newValue) => {
    setActiveDetailsTab(newValue);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!isLoading()) {
      (async () => {
        const allRows = vendorList;
        let data = allRows.find(({ id }) => id == vendorId);
        const [findingsRes, referencesRes] = await Promise.all([
          getReviewFindings(),
          getReviewReferences(),
        ]);

        let findings = findingsRes.data.filter((finding) => finding.ID === vendorId);
        let references = referencesRes.data.filter(
          (reference) => reference.ID === vendorId
        );

        const combinedData = {
          ...data,
          findings,
          references,
        };

        setFindingsRows(findings);
        setReferencesRows(references);
        setVendorData(combinedData);
      })();
    }
  }, [isLoading, vendorList]);

  if (!vendorData || !vendorData.vendor_name) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box justifyContent="space-between" display="flex">
        <Box p={2}>
          <Typography variant="h4">
            {vendorData.vendor_name}
          </Typography>
          <Box display="flex" mt={2}>
            <Box mr={4}>
              <Typography variant="body2">
                {vendorData.category}
              </Typography>
            </Box>
            <Box mr={4}>
              <Typography variant="body2">
                {vendorData.inherent_risk} inherent risk
              </Typography>
            </Box>
            {/*This needs Security Review api*/}
            {/* <Box>
              <Typography variant="body2">
                {vendorData["SECURITY REVIEW"].due_date
                  ? `Security review due ${vendorData["SECURITY REVIEW"].due_date}`
                  : "No due date"}
              </Typography>
            </Box> */}
          </Box>
        </Box>
        <Box p={2}>
          <Box display="flex" mt={2}>
            <Box mr={4}>
              <Button variant="outlined" color="primary">
                Configure inherent risk
              </Button>
            </Box>
            <Box>
              <Button variant="outlined" color="primary">
                <Icon>more_horiz</Icon>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box className={sidebarOpen ? classes.tableOpen : classes.tableClose}>
          <VendorTabs activeTab={activeTab} handleChange={handleChange} />
          <TabPanel activeTab={activeTab} index={0}>
            <Overview
              sidebarOpen={sidebarOpen}
              findings={findingsRows}
              loading={isLoading}
            />
          </TabPanel>
          <TabPanel activeTab={activeTab} index={1}>
            <SecurityReviewTab vendorData={vendorData} />
          </TabPanel>
          <TabPanel activeTab={activeTab} index={2}>
            <References
              references={referencesRows}
              setReferences={setReferencesRows}
              loading={isLoading}
            />
          </TabPanel>
          <TabPanel activeTab={activeTab} index={3}>
            <LinkedApps vendorData={vendorData} />
          </TabPanel>
        </Box>
        <Box
          className={sidebarOpen ? classes.sidebarOpen : classes.sidebarClose}
        >
          <Box display="flex">
            <Box display="flex" justifyContent="space-between" width={"100%"}>
              {sidebarOpen && (
                <Box ml={2} mt={2}>
                  <Typography variant="h6">Additional details</Typography>
                </Box>
              )}
              <Box mt={1} position="fixed" right={0}>
                <Tooltip title={sidebarOpen ? "Collapse" : "Expand"}>
                  <IconButton onClick={toggleSidebar}>
                    {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          {sidebarOpen && (
            <Box mt={1}>
              <Divider />
              <Box ml={2}>
                <OverviewTabs
                  activeTab={activeDetailsTab}
                  handleChange={detailsChange}
                />
              </Box>
              <Box ml={2} m={2}>
                <TabPanel activeTab={activeDetailsTab} index={0}>
                  <Info vendorData={vendorData} />
                </TabPanel>
                <TabPanel activeTab={activeDetailsTab} index={1}>
                  <Findings
                    findings={findingsRows}
                    setFindingsRows={setFindingsRows}
                  />
                </TabPanel>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VendorDetails;
