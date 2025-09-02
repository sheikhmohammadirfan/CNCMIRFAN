import React, { useState, useEffect } from "react";
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
import { REVIEW_STATUS_MAP } from "../../../../assets/data/AccessManagement/ReviewDecisions/ValuesMap";
import SkeletonBox from "../../../Utils/SkeletonBox";
import UploadFileCell from "./UploadFileCell";
import { notification } from "../../../Utils/Utils";
import { uploadAccessFile } from "../../../../Service/AccessManagement/Reviews";

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


const data2 = {
  labels: [
    "Systems requiring access file",
    "Systems requiring connection",
    "Systems ready to review",
  ],
  datasets: [
    {
      data: [4, 3, 7],
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



function DraftStatusContent({ data, loading, hasEditPermission, uploadAccess }) {
  const classes = useStyle();

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <Box border={1} p={2}>
            <Typography variant="h6">Access review progress</Typography>
          </Box>
          <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
            <DoughnutChart data={data2} />
          </Box>
        </Grid>
      </Grid>

      <FiltersOption />

      {loading ?
        <SkeletonBox width='100%' height='30vh' text="Loading Entities..." /> :
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
                  // props: { onClick: () => handleRowClick(index) }, // Adding onClick here
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

export default DraftStatusContent;


