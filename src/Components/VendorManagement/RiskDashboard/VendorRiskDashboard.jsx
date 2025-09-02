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
      "/vendor-management/security-review?review=Need+Review"
    );
  };

  const handleUpToDateClick = () => {
    history.push("/vendor-management/security-review?review=Up+to+Date");
  };

  const handleProgressClick = (dateRange) => {
    if (dateRange === "This month") {
      history.push("/vendor-management/security-review?risk=High&date=This+month");
    } else if (dateRange === "This quarter") {
      history.push("/vendor-management/security-review?risk=High&date=This+quarter");
    } else {
      history.push("/vendor-management/security-review?risk=High&date=This+year");
    }
  }

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

  const handleDiscoveryRiskClick = (level) => {
    switch (level) {
      case "Critical":
        handleDiscoveryCriticalClick();
        break;
      case "High":
        handleDiscoveryHighClick();
        break;
      case "Medium":
        handleDiscoveryMediumClick();
        break;
      default:
        handleDiscoveryLowClick();
        break;
    }
  }

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

  const handleManagedRiskClick = (levels) => {
    switch (levels) {
      case "Unknown":
        handleManagedUnknownClick();
        break;
      case "Critical":
        handleManagedCriticalClick();
        break;
      case "High":
        handleManagedHighClick();
        break;
      case "Medium":
        handleManagedMediumClick();
        break;
      default:
        handleManagedLowClick();
        break;
    }
  }

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
                handleProgressClick={handleProgressClick}
                vendorList={vendorList}
                securityReviewList={securityReviewList}
              />
            </Grid>
            <Grid item xs={12}>
              <DiscoveryOverview
                handleDiscoveryRiskClick={handleDiscoveryRiskClick}
                handleDiscoveryVendorClick={handleDiscoveryVendorClick}
                isLoading={isLoading}
                vendorList={vendorList}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={6}>
            <VendorsManaged
              handleManagedRiskClick={handleManagedRiskClick}
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
