import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Icon,
  makeStyles,
  Typography,
  Divider,
  Button
} from "@material-ui/core";
import Chip from "@mui/material/Chip";
import { tableMockData } from "../../Accounts/AccountsColumns";
import DataTable from "../../../Utils/DataTable/DataTable";
import SystemCards from "../SystemCards";
import FiltersOption from "../FiltersOption";
import DoughnutChart from "../DoughnutChart";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { getReviewAccessList, getReviewEntities } from "../../../../Service/AccessManagement/Reviews";
import SkeletonBox from "../../../Utils/SkeletonBox";
import { REVIEW_STATUS_MAP } from "../../../../assets/data/AccessManagement/ReviewDecisions/ValuesMap";
import UploadFileCell from "./UploadFileCell";

const useStyle = makeStyles((theme) => ({
  usersContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "auto",
    paddingTop: "0",
    padding: theme.spacing(2),
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  exp_Del_Button: {
    color: theme.palette.primary.main,
    textTransform: "none",
  },
  systemsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  tableStyle: {
    "& tbody td": { background: "#fff" },
    "& tbody td:not(:first-child)": { overflow: "hidden" },
    "& [checkbox]": { position: "sticky !important", left: 0, zIndex: 2 },
    "& [poam-id]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },
    "& [header]": {
      zIndex: "3 !important",
      "&[poam-id]": { zIndex: "2 !important" },
    },
    "& thead th:not(:first-child)": {
      "&::before, &::after": {
        position: "absolute",
        fontFamily: "Material Icons",
        right: 0,
        fontSize: 18,
        width: 10,
      },
      "&::before": {
        content: "'\\2193'",
        color: theme.palette.grey[400],
        display: "flex",
        top: 8,
        right: 3,
      },
      "&::after": {
        content: "'\\2191'",
        color: theme.palette.grey[400],
        top: 8,
        right: 10,
      },
      "&.asc::before": {
        content: "'\\2193'",
        color: "#4477CE",
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: "#4477CE",
      },
    },
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: "inset 4px 0 0 0 #4477CE",
    },
    "& tr.Mui-selected td": {
      background: "#e6f6f4 !important",
    },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },
    cursor: "pointer",
  },
  dataTableContainer: {
    "& > div": { maxHeight: "50vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
  menuText: {
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
  },
  menuIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: "1rem",
  },
}));


const data = {
  labels: ["Not started", "In progress", "Completed"],
  datasets: [
    {
      data: [0, 1, 0],
      backgroundColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
      borderColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
      borderWidth: 1,
    },
  ],
};

const getStatusChip = (status) => {
  switch (status) {
    case "Completed":
      return (
        <Chip
          variant="outlined"
          label="Completed"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "green" }}>radio_button_checked</Icon>}
        />
      );
    case "In Review":
      return (
        <Chip
          variant="outlined"
          label="In Review"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "yellow" }}>radio_button_checked</Icon>}
        />
      );
    case "Draft":
      return (
        <Chip
          variant="outlined"
          label="Draft"
          style={{ minWidth: "100px" }}
          icon={<Icon style={{ color: "gray" }}>radio_button_checked</Icon>}
        />
      );
    default:
      return <Chip label={status} />;
  }
};



function InReviewStatusContent({ data, loading, hasEditPermission, uploadAccess }) {
  const classes = useStyle();
  const history = useHistory();
  const location = useLocation();

  const handleRowClick = (index) => {
    const selectedReview = data[index]
    history.push(`/access-management/reviews/in-review/review-decisions/${index}`, {
      data: selectedReview,
    });
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} md={6} lg={6}>
          <Box border={1} p={2}>
            <Typography variant="h6">Access review progress</Typography>
          </Box>
          <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
            <DoughnutChart data={{
              labels: ["Not started", "In progress", "Completed"],
              datasets: [
                {
                  data: [0, 1, 0],
                  backgroundColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
                  borderColor: ["#A9A9A9", "#FF6384", "#4BC0C0"],
                  borderWidth: 1,
                },
              ],
            }} />
          </Box>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <Box border={1} p={2}>
            <Typography variant="h6">Accounts flagged by Falcon</Typography>
          </Box>
          <Box
            borderBottom={1}
            borderRight={1}
            borderLeft={1}
            p={2}
            overflow="auto"
            height="183px"
          >
            <Button fullWidth>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                sx={{ textTransform: "none" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    <Typography align="left">Project Sigma</Typography>
                  </Box>
                  <Box>
                    <Typography>hanz@cncmllc.com</Typography>
                  </Box>
                </Box>
                <Box p={2}>
                  <Typography>Owner terminated</Typography>
                </Box>
              </Box>
            </Button>
            <Divider />
            <Button fullWidth>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                sx={{ textTransform: "none" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    <Typography align="left">Project Sigma</Typography>
                  </Box>
                  <Box>
                    <Typography>hanz@cncmllc.com</Typography>
                  </Box>
                </Box>
                <Box p={2}>
                  <Typography>Owner group changed</Typography>
                </Box>
              </Box>
            </Button>
            <Divider />
            <Button fullWidth>
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                sx={{ textTransform: "none" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    <Typography align="left">Project Sigma</Typography>
                  </Box>
                  <Box>
                    <Typography>hanz@cncmllc.com</Typography>
                  </Box>
                </Box>
                <Box p={2}>
                  <Typography>Owner group changed</Typography>
                </Box>
              </Box>
            </Button>
          </Box>
        </Grid>
      </Grid>

      <FiltersOption />

      {loading ?
        <SkeletonBox text="Loading Review Entities..." height='30vh' width='100%' /> :
        <Grid container spacing={1} className={classes.dataTableContainer}>
          <Grid item xs={12}>
            <DataTable
              className={classes.tableStyle}
              checkbox={false}
              serialNo={false}
              stickyHeader={true}
              verticalBorder={true}
              resizeTable={true}
              header={{
                data: [
                  { text: "System" },
                  { text: "Reviewer" },
                  { text: "Access Data" },
                  { text: "Status" },
                ],
              }}
              rowList={{
                rowData: data.map((item, index) => ({
                  data: [
                    { text: item.entity },
                    { text: item.reviewer },
                    {
                      text:
                        <UploadFileCell
                          uploaded={item.uploaded}
                          row={item}
                          handleFileInputChange={uploadAccess}
                          disabled={!hasEditPermission}
                        />
                    },
                    {
                      text: getStatusChip(REVIEW_STATUS_MAP[item.status]),
                    },
                  ],
                  props: { onClick: () => handleRowClick(index) }, // Adding onClick here
                })),
              }}
              minCellWidth={[300, 300, 300, 250]}
            />
          </Grid>
        </Grid>
      }
    </>
  );
}

export default InReviewStatusContent;










