import { Box, Typography, Divider, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import SecurityReviewProgress from "./SecurityReviewProgress";
import DiscoveryOverview from "./DiscoveryOverview";
import VendorsManaged from "./VendorsManaged";

const VendorRiskDashboard = () => {
  const history = useHistory();

  //Security review methods
  const handleNeedsUpdateClick = () => {
    history.push("/vendor_management/security_review?review=Needs+update");
  };

  const handleNeedsInitialReviewClick = () => {
    history.push(
      "/vendor_management/security_review?review=Needs+initial+review"
    );
  };

  const handleUpToDateClick = () => {
    history.push("/vendor_management/security_review?review=Up+to+date");
  };

  // Discovery methods
  const handleDiscoveryCriticalClick = () => {
    history.push("/vendor_management/requirement_analysis?risk=Critical");
  };

  const handleDiscoveryHighClick = () => {
    history.push("/vendor_management/requirement_analysis?risk=High");
  };

  const handleDiscoveryMediumClick = () => {
    history.push("/vendor_management/requirement_analysis?risk=Medium");
  };

  const handleDiscoveryLowClick = () => {
    history.push("/vendor_management/requirement_analysis?risk=Low");
  };

  const handleDiscoveryVendorClick = (vendorName) => {
    history.push(
      `/vendor_management/requirement_analysis?searchValue=${vendorName}`
    );
  };

  // Managed vendors methods
  const handleManagedUnknownClick = () => {
    history.push("/vendor_management/assessment?risk=Unknown");
  };

  const handleManagedCriticalClick = () => {
    history.push("/vendor_management/assessment?risk=Critical");
  };

  const handleManagedHighClick = () => {
    history.push("/vendor_management/assessment?risk=High");
  };

  const handleManagedMediumClick = () => {
    history.push("/vendor_management/assessment?risk=Medium");
  };

  const handleManagedLowClick = () => {
    history.push("/vendor_management/assessment?risk=Low");
  };

  const handleCategoryClick = (categoryName) => {
    history.push(`/vendor_management/assessment?category=${categoryName}`);
  };

  return (
    <Box>
      <Box m={2}>
        <Typography variant="h4">Risk Dashboard</Typography>
      </Box>
      <Divider />
      <Box>
        <Grid container spacing={2} p={2} direction="row">
          <Grid item xs={12} md={12} lg={12} xl={6} container direction="row">
            <Grid item xs={12}>
              <SecurityReviewProgress
                handleNeedsUpdateClick={handleNeedsUpdateClick}
                handleNeedsInitialReviewClick={handleNeedsInitialReviewClick}
                handleUpToDateClick={handleUpToDateClick}
              />
            </Grid>
            <Grid item xs={12}>
              <DiscoveryOverview
                handleDiscoveryCriticalClick={handleDiscoveryCriticalClick}
                handleDiscoveryHighClick={handleDiscoveryHighClick}
                handleDiscoveryMediumClick={handleDiscoveryMediumClick}
                handleDiscoveryLowClick={handleDiscoveryLowClick}
                handleDiscoveryVendorClick={handleDiscoveryVendorClick}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={6}>
            <VendorsManaged
              handleManagedUnknownClick={handleManagedUnknownClick}
              handleManagedCriticalClick={handleManagedCriticalClick}
              handleManagedHighClick={handleManagedHighClick}
              handleManagedMediumClick={handleManagedMediumClick}
              handleManagedLowClick={handleManagedLowClick}
              handleCategoryClick={handleCategoryClick}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorRiskDashboard;
