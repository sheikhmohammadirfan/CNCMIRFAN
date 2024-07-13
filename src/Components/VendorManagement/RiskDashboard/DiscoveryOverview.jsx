import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  button: {
    textTransform: "none",
    justifyContent: "space-between",
  },
  criticalIcon: {
    marginRight: 8,
    color: "red",
  },
  highIcon: {
    marginRight: 8,
    color: "orange",
  },
  mediumIcon: {
    marginRight: 8,
    color: "gold",
  },
  lowIcon: {
    marginRight: 8,
    color: "green",
  },
});

const DiscoveryOverview = ({
  handleDiscoveryCriticalClick,
  handleDiscoveryHighClick,
  handleDiscoveryMediumClick,
  handleDiscoveryLowClick,
  handleDiscoveryVendorClick,
}) => {
  const classes = useStyles();

  return (
    <Box border={1} p={2} borderColor="#ddd" mt={2} borderRadius={16}>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Discovery
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleDiscoveryCriticalClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon className={classes.criticalIcon} />
                  <Typography>Critical</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">0</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleDiscoveryHighClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon className={classes.highIcon} />
                  <Typography>High</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">4</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleDiscoveryMediumClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon className={classes.mediumIcon} />
                  <Typography>Medium</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">12</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              className={classes.button}
              onClick={handleDiscoveryLowClick}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon className={classes.lowIcon} />
                  <Typography>Low</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">12</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Button
          fullWidth
          className={classes.button}
          onClick={() => handleDiscoveryVendorClick("Lucid")}
        >
          <Typography variant="body1">Lucid</Typography>
          <Box display="flex" alignItems="center">
            <FiberManualRecordIcon className={classes.highIcon} />
            <Typography>High</Typography>
          </Box>
        </Button>
        <Divider />
        <Button
          fullWidth
          className={classes.button}
          onClick={() => handleDiscoveryVendorClick("Calendly")}
        >
          <Typography variant="body1">Calendly (2 results)</Typography>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon className={classes.mediumIcon} />
              <Typography>Medium</Typography>
            </Box>
          </Box>
        </Button>
        <Divider />
        <Button
          fullWidth
          className={classes.button}
          onClick={() => handleDiscoveryVendorClick("LinkedIn")}
        >
          <Typography variant="body1">LinkedIn</Typography>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon className={classes.lowIcon} />
              <Typography>Low</Typography>
            </Box>
          </Box>
        </Button>
        <Divider />
        <Button
          fullWidth
          className={classes.button}
          onClick={() => handleDiscoveryVendorClick("AWS")}
        >
          <Typography variant="body1">AWS</Typography>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon className={classes.criticalIcon} />
              <Typography>Critical</Typography>
            </Box>
          </Box>
        </Button>
        <Divider />
        <Button
          fullWidth
          className={classes.button}
          onClick={() => handleDiscoveryVendorClick("LucidChart")}
        >
          <Typography variant="body1">LucidChart</Typography>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon className={classes.mediumIcon} />
              <Typography>Medium</Typography>
            </Box>
          </Box>
        </Button>
      </Box>
      <Box mt={2}>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          component={Link}
          to="/vendor_management/requirement_analysis"
        >
          Show all
        </Button>
      </Box>
    </Box>
  );
};

export default DiscoveryOverview;
