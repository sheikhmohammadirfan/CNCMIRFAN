import {
  Box,
  Typography,
  makeStyles,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import CloudIcon from "@material-ui/icons/Cloud";
import ComputerIcon from "@material-ui/icons/Computer";
import BusinessIcon from "@material-ui/icons/Business";

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "100%",
    position: "relative",
    margin: "auto",
  },
  pill: {
    background: "#ffffff",
    padding: "10px 30px",
    borderRadius: "25px",
    display: "flex",
    boxShadow: theme.shadows[1],
    position: "fixed",
    bottom: theme.spacing(2),
    maxWidth: 900,
    width: "70%",
    transition: "width 0.3s ease-in-out",
    gap: theme.spacing(4),
    zIndex: 4,
  },
  detail: {
    display: "flex",
    alignItems: "center",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  label: {
    color: "#000000",
    marginRight: theme.spacing(1),
  },
  value: {
    color: theme.palette.grey[700],
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    flexShrink: 1,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: "#000000",
  },
}));

// Shows the detail name on hover
const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 20,
    maxWidth: 300,
  },
}))(Tooltip);

const PoamDetails = ({ poamDetails, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.pill}>
        <CustomTooltip className={classes.tip} title={poamDetails.cspName}>
          <Box className={classes.detail}>
            <CloudIcon className={classes.icon} />
            <Typography className={classes.label}>CSP:</Typography>
            <Typography className={classes.value}>
              {loading ? "Loading..." : poamDetails.cspName}
            </Typography>
          </Box>
        </CustomTooltip>
        <CustomTooltip title={poamDetails.systemName}>
          <Box className={classes.detail}>
            <ComputerIcon className={classes.icon} />
            <Typography className={classes.label}>System:</Typography>
            <Typography className={classes.value}>
              {loading ? "Loading..." : poamDetails.systemName}
            </Typography>
          </Box>
        </CustomTooltip>
        <CustomTooltip title={poamDetails.agencyName}>
          <Box className={classes.detail}>
            <BusinessIcon className={classes.icon} />
            <Typography className={classes.label}>Agency:</Typography>
            <Typography className={classes.value}>
              {loading ? "Loading..." : poamDetails.agencyName}
            </Typography>
          </Box>
        </CustomTooltip>
      </Box>
    </Box>
  );
};

export default PoamDetails;
