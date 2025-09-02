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
  handleDiscoveryRiskClick,
  handleDiscoveryVendorClick,
  vendorList
}) => {
  const classes = useStyles();

  const riskLevel = ["Critical", "High", "Medium", "Low"];
  const riskColor = ["criticalIcon", "highIcon", "mediumIcon", "lowIcon"];

  const unManagedVendors = vendorList.filter(v => !v.managed);
  const riskCounts = riskLevel.map(r => unManagedVendors.filter(v => v.inherent_risk === r).length);

  return (
    <Box border={1} p={2} borderColor="#ddd" mt={2} borderRadius={16}>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Discovery
        </Typography>
      </Box>
      <Box>
      
        <Grid container spacing={2}>
          {riskLevel.map((level, idx) => (<Grid item xs={3}>
            <Button
              fullWidth
              className={classes.button}
              onClick={() => handleDiscoveryRiskClick(level)}
            >
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon className={classes[riskColor[idx]]} />
                  <Typography>{level}</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">{riskCounts[idx]}</Typography>
                </Box>
              </Box>
            </Button>
          </Grid>))}
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
          to="/vendor-management/requirement-analysis"
        >
          Show all
        </Button>
      </Box>
    </Box>
  );
};

export default DiscoveryOverview;
