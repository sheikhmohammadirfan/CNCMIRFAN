import { Box, Typography, Divider, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import SecurityReviewProgress from "./SecurityReviewProgress";
import DiscoveryOverview from "./DiscoveryOverview";
import VendorsManaged from "./VendorsManaged";

const VendorRiskDashboard = ({ isLoading, vendorList, securityReviewList }) => {
  const history = useHistory();

  //Security review methods
  const handleNeedsUpdateClick = () => {
    history.push("/vendor-management/security-review?review=Need+Update");
  };

  const handleNeedsInitialReviewClick = () => {
    history.push(
      "/vendor-management/security-review?review=Needs+Review"
    );
  };

  const handleUpToDateClick = () => {
    history.push("/vendor-management/security-review?review=Up+To+Date");
  };

  // Discovery methods
  const handleDiscoveryCriticalClick = () => {
    history.push("/vendor-management/requirement-analysis?risk=Critical");
  };

  const handleDiscoveryHighClick = () => {
    history.push("/vendor-management/requirement-analysis?risk=High");
  };

  const handleDiscoveryMediumClick = () => {
    history.push("/vendor-management/requirement-analysis?risk=Medium");
  };

  const handleDiscoveryLowClick = () => {
    history.push("/vendor-management/requirement-analysis?risk=Low");
  };

  const handleDiscoveryVendorClick = (vendorName) => {
    history.push(
      `/vendor-management/requirement-analysis?searchValue=${vendorName}`
    );
  };

  // Managed vendors methods
  const handleManagedUnknownClick = () => {
    history.push("/vendor-management/assessment?risk=Unknown");
  };

  const handleManagedCriticalClick = () => {
    history.push("/vendor-management/assessment?risk=Critical");
  };

  const handleManagedHighClick = () => {
    history.push("/vendor-management/assessment?risk=High");
  };

  const handleManagedMediumClick = () => {
    history.push("/vendor-management/assessment?risk=Medium");
  };

  const handleManagedLowClick = () => {
    history.push("/vendor-management/assessment?risk=Low");
  };

  const handleCategoryClick = (categoryName) => {
    history.push(`/vendor-management/assessment?category=${categoryName}`);
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
                isLoading={isLoading}
                vendorList={vendorList}
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
              isLoading={isLoading}
              vendorList={vendorList}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorRiskDashboard;
