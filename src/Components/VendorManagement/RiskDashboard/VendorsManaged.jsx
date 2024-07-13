import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  makeStyles,
} from "@material-ui/core";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  unknownIcon: {
    marginRight: 8,
    color: "gray",
  },
});

const VendorsManaged = ({
  handleManagedUnknownClick,
  handleManagedCriticalClick,
  handleManagedHighClick,
  handleManagedMediumClick,
  handleManagedLowClick,
  handleCategoryClick,
}) => {
  const classes = useStyles();
  const [category, setCategory] = useState("category");

  const dataSets = {
    category: [12, 19, 3],
  };

  const labels = [
    "Recruiting",
    "Tech",
    "Unknown",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataSets[category],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true, // Use point style instead of rectangles
          pointStyle: "rectRounded", // Use rounded rectangles for point style
          boxWidth: 10, // Custom size for legend squares
          boxHeight: 10, // Custom size for legend squares
        },
      },
    },
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleCategoryClick(labels[index])
      }
    },
  };

  return (
    <Box border={1} p={2} borderColor="#ddd" borderRadius={16}>
      <Box mb={2}>
        <Typography variant="h5">Vendors Managed</Typography>
        <Box mt={2} display="flex" flexDirection="row" alignItems="center">
          <Box mr={1}>
            <Typography variant="h5">26</Typography>
          </Box>
          <Box>
            <ArrowUpward fontSize="small" />
          </Box>
          <Box mr={1}>
            <Typography variant="body1">1 since last week</Typography>
          </Box>
        </Box>
      </Box>
      <Box mb={2}>
        <Typography variant="body1">By inherent risk level</Typography>
        <Box mt={2}>
          <Button
            fullWidth
            className={classes.button}
            onClick={handleManagedUnknownClick}
          >
            <Box display="flex" flexDirection="column">
              <Box display="flex" alignItems="center">
                <FiberManualRecordIcon className={classes.unknownIcon} />
                <Typography>Unknown</Typography>
              </Box>
            </Box>

            <Typography variant="body1">0% (0)</Typography>
          </Button>
          <Divider />
          <Button
            fullWidth
            className={classes.button}
            onClick={handleManagedCriticalClick}
          >
            <Box display="flex" flexDirection="column">
              <Box display="flex" alignItems="center">
                <FiberManualRecordIcon className={classes.criticalIcon} />
                <Typography>Critical</Typography>
              </Box>
            </Box>
            <Typography variant="body1">0% (0)</Typography>
          </Button>
          <Divider />
          <Button
            fullWidth
            className={classes.button}
            onClick={handleManagedHighClick}
          >
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon className={classes.highIcon} />
              <Typography>High</Typography>
            </Box>
            <Typography variant="body1">61.5% (16)</Typography>
          </Button>
          <Divider />
          <Button
            fullWidth
            className={classes.button}
            onClick={handleManagedMediumClick}
          >
            <Box display="flex" flexDirection="column">
              <Box display="flex" alignItems="center">
                <FiberManualRecordIcon className={classes.mediumIcon} />
                <Typography>Medium</Typography>
              </Box>
            </Box>
            <Typography variant="body1">34.6% (9)</Typography>
          </Button>
          <Divider />
          <Button
            fullWidth
            className={classes.button}
            onClick={handleManagedLowClick}
          >
            <Box display="flex" flexDirection="column">
              <Box display="flex" alignItems="center">
                <FiberManualRecordIcon className={classes.lowIcon} />
                <Typography>Low</Typography>
              </Box>
            </Box>
            <Typography variant="body1">3.8% (1)</Typography>
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography variant="body1">By category</Typography>
        <Box display="flex" width="600px" height="400px">
          <Doughnut data={data} options={options} />
        </Box>
      </Box>
    </Box>
  );
};

export default VendorsManaged;
