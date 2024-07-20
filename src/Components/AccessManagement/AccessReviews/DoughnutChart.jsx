import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, makeStyles } from "@material-ui/core";

ChartJS.register(ArcElement, Tooltip, Legend);

const useStyles = makeStyles({
  chartContainer: {
    height: "150px",
    width: "400px",
  },
});

const DoughnutChart = ( {data} ) => {
  const classes = useStyles();

  const options = {
    cutout: "85%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 10,
          boxHeight: 10,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box className={classes.chartContainer}>
        <Doughnut data={data} options={options} />
      </Box>
    </Box>
  );
};

export default DoughnutChart;