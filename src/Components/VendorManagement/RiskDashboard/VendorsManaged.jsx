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
import SkeletonBox from "../../Utils/SkeletonBox";
import colorShader from "../../Utils/ColorShader";

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

function getRandomColor() {
  var evenletters = '0123456789';
  var oddletters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += i % 2
              ? evenletters[Math.floor(Math.random() * 10)]
              : oddletters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const VendorsManaged = ({
  handleManagedRiskClick,
  handleCategoryClick,
  isLoading,
  vendorList
}) => {

  const classes = useStyles();

  const riskLevel = ["Unknown", "Critical", "High", "Medium", "Low"];
  const riskColor = ["unknownIcon", "criticalIcon", "highIcon", "mediumIcon", "lowIcon"];

  const managedVendors = vendorList.filter(v => v.managed);
  const riskRatios = riskLevel.map(r => {
    const rC = managedVendors.filter(v => v.inherent_risk === r).length;
    return [Math.round((rC / managedVendors.length) * 100) || 0, rC];
  });

  const labels = Array.from(new Set(managedVendors.map(v => v.category)));
  const values = labels.map(l => managedVendors.filter(v => v.category === l).length);
  const backgroundColor = labels.map(getRandomColor);
  const hoverColor = backgroundColor.map(c => colorShader(c, 0.75));

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverColor,
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
    <Box border={1} p={2} borderColor="#ddd" borderRadius={16} overflow="hidden">
      <Box mb={2}>
        <Typography variant="h5">Vendors Managed</Typography>
        <Box mt={2} display="flex" flexDirection="row" alignItems="center">
          <Box mr={1}>
            <Typography variant="h5">{managedVendors.length}</Typography>
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
          {riskLevel.map((level, idx) => 
            <>
              <Button
                fullWidth
                className={classes.button}
                onClick={() => handleManagedRiskClick(level)}
              >
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center">
                    <FiberManualRecordIcon className={classes[riskColor[idx]]} />
                    <Typography>{level}</Typography>
                  </Box>
                </Box>

                <Typography variant="body1">{riskRatios[idx][0]}% ({riskRatios[idx][1]})</Typography>
              </Button>
              {idx < riskLevel.length && <Divider />}
            </>)}
        </Box>
      </Box>
      <Box>
        <Typography variant="body1">By category</Typography>
        {isLoading()
          ? <SkeletonBox text="Loading.." height="400px" width="100%" />
          : (
            <Box display="flex" width="100%" height="400px">
              <Doughnut data={data} options={options} />
            </Box>
          )}
        
      </Box>
    </Box>
  );
};

export default VendorsManaged;
