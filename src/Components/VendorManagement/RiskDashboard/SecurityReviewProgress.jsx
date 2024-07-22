import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  makeStyles,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useState } from "react";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlagIcon from "@material-ui/icons/Flag";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
}));

const useStyles = makeStyles({
  button: {
    textTransform: "none",
  },
});

const SecurityReviewProgress = ({
  handleNeedsUpdateClick,
  handleNeedsInitialReviewClick,
  handleUpToDateClick,
  handleProgressClick,
  vendorList,
  securityReviewList
}) => {
  const classes = useStyles();
  const [dateRange, setDateRange] = useState("This month");
  const [dueReviews, setDueReviews] = useState([]);

  const handleChange = (event) => {
    setDateRange(event.target.value);
  };

  const highRiskVendors = vendorList.filter(vendor => vendor.inherent_risk === "High");

  const highRiskVendorsWithReviews = highRiskVendors.map(vendor => {
    const reviews = securityReviewList.filter(review => review.vendor == vendor.id);
    if (reviews.length > 0) {
        return { ...vendor, reviews: reviews };
    }
    return null;
  }).filter(vendor => vendor !== null);

  const notCompletedVendors = highRiskVendorsWithReviews.map(vendor => {
      const reviews = vendor.reviews.filter(review => review.review_status === false);
      if (reviews.length > 0) {
          return { ...vendor, reviews: reviews };
      }
      return null;
  }).filter(vendor => vendor !== null);

  const needsUpdateVendors = vendorList.filter(vendor =>
    securityReviewList.some(review => review.vendor === vendor.id && review.review_status_reason === "Need Update")
  ).map(vendor => {
    return {
      ...vendor,
      reviews: securityReviewList.filter(review => review.vendor === vendor.id && review.review_status_reason === "Need Update")
    };
  });

  const needsInitialReviewVendors = vendorList.filter(vendor =>
    securityReviewList.some(review => review.vendor === vendor.id && review.review_status_reason === "Need Review")
  ).map(vendor => {
    return {
      ...vendor,
      reviews: securityReviewList.filter(review => review.vendor === vendor.id && review.review_status_reason === "Need Review")
    };
  });

  const upToDateVendors = vendorList.filter(vendor =>
    securityReviewList.some(review => review.vendor === vendor.id && review.review_status_reason === "Up to Date")
  ).map(vendor => {
    return {
      ...vendor,
      reviews: securityReviewList.filter(review => review.vendor === vendor.id && review.review_status_reason === "Up to Date")
    };
  });

  return (
    <Box border={1} borderColor="#ddd" p={2} borderRadius={16}>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Security Reviews Progress
        </Typography>
      </Box>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleNeedsUpdateClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon style={{ color: "red", marginRight: 8 }} />
                  <Typography>Need Update</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">{needsUpdateVendors.length}</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleNeedsInitialReviewClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FlagIcon style={{ color: "orange", marginRight: 8 }} />
                  <Typography>Needs Initial review</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">{needsInitialReviewVendors.length}</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleUpToDateClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon style={{ color: "green", marginRight: 8 }} />
                  <Typography>Up To Date</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">{upToDateVendors.length}</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Typography variant="body1">
          For reviews with a known due date
        </Typography>
        <FormControl size="small">
          <Select
            displayEmpty
            variant="outlined"
            fullWidth
            value={dateRange}
            onChange={handleChange}
          >
            <MenuItem value={"This month"}>This month</MenuItem>
            <MenuItem value={"This quarter"}>This quarter</MenuItem>
            <MenuItem value={"This year"}>This year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {dueReviews ? (
        <Button fullWidth className={classes.button} onClick={handleProgressClick}>
          <Box width="100%" display="flex" flexDirection="column" p={1}>
            <Typography align="left" variant="h6">
              High risk vendors
            </Typography>
            <Stack spacing={2} sx={{ flexGrow: 1 }} mt={2}>
              <BorderLinearProgress
                variant="determinate"
                value={((highRiskVendorsWithReviews.length - notCompletedVendors.length) / highRiskVendorsWithReviews.length) * 100}
              />
            </Stack>
            <Box
              justifyContent="space-between"
              display="flex"
              flexDirection="row"
              mt={2}
            >
              <Box>
                <Typography>{highRiskVendorsWithReviews.length - notCompletedVendors.length} completed</Typography>
              </Box>
              <Box>
                <Typography>{highRiskVendorsWithReviews.length} total</Typography>
              </Box>
            </Box>
          </Box>
        </Button>
      ) : (
        <Box mt={2}>
          <Typography align="center">
            No reviews due in this time frame.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SecurityReviewProgress;
