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
  Grid,
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
  listFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  listReferences,
  createReferences,
  updateReferences,
  deleteReference,
} from "../../../Service/VendorManagement/VendorManagement.service";
import { useStyle } from "../Utils";

const VendorDetails = ({ isLoading, vendorList, securityReviewList, reload }) => {
  const classes = useStyle();
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState(0);
  const [findingsRows, setFindingsRows] = useState([]);
  const [referencesRows, setReferencesRows] = useState([]);
  const [reviewId, setReviewId] = useState(0);

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
        const allRows = vendorList.filter((vendor) => vendor.managed === true);
        let data = allRows.find(({ id }) => id == vendorId);
        const [findingsRes, referencesRes] = await Promise.all([
          listFindings(),
          listReferences(),
        ]);
        const review = securityReviewList.find((review) => review.vendor == vendorId);
        let findings = review ? findingsRes.data.filter((finding) => finding.review == review.id) : null;
        let references = review ? referencesRes.data.filter((reference) => reference.id == review.id) : null;
        if (review) setReviewId(review.id);
        
        const combinedData = {
          ...data,
          findings,
          references,
        };
        setFindingsRows(findings || []);
        setReferencesRows(references || []);
        setVendorData(combinedData);
        console.log(vendorData, "vendordata")
      })();
    }
  }, [isLoading, vendorList]);

  if (!vendorData || !vendorData.vendor_name) {
    return <CircularProgress />;
  }

  const handleCreateFinding = async (desc) => {
    const payload = {
      "review": reviewId,
      "description": desc,
    }
    let res = await createFinding(payload);
    if (res.status) {
      reload();
      return;
    }
  };

  const handleEditFinding = async (id, newDesc) => {
    const payload = {
      "description": newDesc,
    };
    let res = await updateFinding(id, payload);
    if (res.status) {
      reload();
      return;
    }
  }

  const handleDeleteFinding = async (id) => {
    let res = await deleteFinding(id);
    if (res.status) {
      reload();
      return;
    }
  }

  const handleFindings = async (action, data) => {
    if (action === "add") {
      return handleCreateFinding(data);
    } else if (action === "edit") {
      const { id, description } = data;
      return handleEditFinding(id, description);
    } else if (action === "delete") {
      return handleDeleteFinding(data);
    }
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
            <Box>
              <Typography variant="body2">
                {vendorData.review && vendorData.review.due_date
                  ? `Security review due ${vendorData.review.due_date}`
                  : "No due date"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box p={2}>
          <Box display="flex" mt={2}>
            <Box mr={4}>
              <Button variant="outlined" color="primary" className={classes.button}>
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
      <Grid container className={classes.vdContainer}>
        <Grid item xs={sidebarOpen ? 9 : 11}>
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
        </Grid>
        <Grid item xs={sidebarOpen ? 2.4 : 0}>
          <Box className={sidebarOpen ? classes.sidebarOpen : classes.sidebarClose}>
            <Box display="flex" justifyContent="space-between">
              {sidebarOpen && (
                <Box ml={2} mt={2}>
                  <Typography variant="h6">Additional details</Typography>
                </Box>
              )}
              <Box mt={1} align="right">
                <Tooltip title={sidebarOpen ? "Collapse" : "Expand"}>
                  <IconButton onClick={toggleSidebar}>
                    {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {sidebarOpen && (
              <>
                <Divider />
                <Box>
                  <OverviewTabs
                    activeTab={activeDetailsTab}
                    handleChange={detailsChange}
                  />
                </Box>
                <Box ml={2} mt={2}>
                  <TabPanel activeTab={activeDetailsTab} index={0}>
                    <Info vendorData={vendorData} />
                  </TabPanel>
                  <TabPanel activeTab={activeDetailsTab} index={1}>
                    <Findings
                      findings={findingsRows}
                      setFindingsRows={handleFindings}
                    />
                  </TabPanel>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetails;
