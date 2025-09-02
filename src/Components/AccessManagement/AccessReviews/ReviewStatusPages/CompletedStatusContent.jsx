import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Icon,
  makeStyles,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Chip from "@mui/material/Chip";
import { tableMockData } from "../../Accounts/AccountsColumns";
import DataTable from "../../../Utils/DataTable/DataTable";
import SystemCards from "../SystemCards";
import FiltersOption from "../FiltersOption";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { TextControl } from "../../../Utils/Control";
import OptionDropdown from "../../../RiskManagement/RiskRegister/OptionDropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { REVIEW_STATUS_MAP } from "../../../../assets/data/AccessManagement/ReviewDecisions/ValuesMap";
import SkeletonBox from "../../../Utils/SkeletonBox";
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

function CompletedStatusContent({ data, loading, hasEditPermission, uploadAccess }) {
  const classes = useStyle();
  const [value, setValue] = useState("1");
  const [searchValue, setSearchValue] = useState("");
  const [systemOpen, setSystemOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState("");
  const [reviewerOpen, setReviewerOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };

  const handleRowClick = (index) => {
    const selectedItem = data[index]
    history.push(`/access-management/reviews/completed/review-decisions/${index}`, {
      data: selectedItem,
    });
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }} style={{ marginTop: "20px" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Systems" value="1" />
            <Tab label="Access changes" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" style={{ padding: "24px 0" }}>
          <Box className={classes.systemsContainer} width="100%">
            <SystemCards
              iconName="fact_check"
              title="# of systems reviewed"
              count="1"
            />
            <SystemCards
              iconName="how_to_reg"
              title="# of accounts reviewed"
              count="163"
            />
            <SystemCards
              iconName="warning"
              title="# of accounts flagged"
              count="0"
            />
            <SystemCards
              iconName="manage_accounts"
              title="# of access changes"
              count="12"
            />
          </Box>

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
                      props: { onClick: () => handleRowClick(index) }, // Adding onClick here
                    })),
                  }}
                  minCellWidth={[300, 300, 300, 250]}
                />
              </Grid>
            </Grid>
          }
        </TabPanel>
        <TabPanel value="2">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 0",
              gap: "30px",
            }}
          >
            <Box display="flex" gridColumnGap={15} alignItems="center">
              <TextControl
                variant="outlined"
                placeholder="Search"
                size="small"
                gutter={false}
                label=" "
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton size="small">
                        <Icon>search</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Box>

            <Box display="flex" alignItems="center" gridColumnGap={10}>
              <OptionDropdown
                open={systemOpen}
                handleClose={() => setSystemOpen(false)}
                placement="bottom-start"
                options={[
                  {
                    text: "Draft",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedSystem)("System 1"),
                  },
                  {
                    text: "Completed",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedSystem)("System 2"),
                  },
                  {
                    text: "Clear",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedSystem)(""),
                  },
                ]}
              >
                <Button
                  size="medium"
                  endIcon={
                    <Icon style={{ rotate: "90deg" }}>
                      arrow_forward_ios
                    </Icon>
                  }
                  className={classes.dropdownButton}
                  style={{
                    backgroundColor: "transparent",
                    color: "#4477CE",
                    textTransform: "none",
                    paddingInline: 10,
                    border: "none",
                  }}
                  onClick={() => setSystemOpen((prev) => !prev)}
                >
                  {selectedSystem || "System"}
                </Button>
              </OptionDropdown>
              <OptionDropdown
                open={reviewerOpen}
                handleClose={() => setReviewerOpen(false)}
                placement="bottom-start"
                options={[
                  {
                    text: "Reviwer 1",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedReviewer)(
                        "Reviwer 1"
                      ),
                  },
                  {
                    text: "Reviwer 2",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedReviewer)(
                        "Reviwer 2"
                      ),
                  },
                  {
                    text: "Clear",
                    clickHandler: () =>
                      handleDropdownChange(setSelectedReviewer)(""),
                  },
                ]}
              >
                <Button
                  size="medium"
                  endIcon={
                    <Icon style={{ rotate: "90deg" }}>
                      arrow_forward_ios
                    </Icon>
                  }
                  className={classes.dropdownButton}
                  style={{
                    backgroundColor: "transparent",
                    color: "#4477CE",
                    textTransform: "none",
                    paddingInline: 10,
                    border: "none",
                  }}
                  onClick={() => setReviewerOpen((prev) => !prev)}
                >
                  {selectedReviewer || "Reviewer"}
                </Button>
              </OptionDropdown>
            </Box>
          </Box>

          <Grid
            container
            spacing={1}
            className={classes.dataTableContainer}
          >
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
                    { text: "SYSTEM" },
                    { text: "ACCOUNT NAME" },
                    { text: "REVIEWED BY" },
                    { text: "REVIEW DECISION" },
                    { text: "NOTE/TASK" },
                    { text: "REMEDIATION STATUS" },
                  ],
                }}
                rowList={{
                  rowData: data.map((item, index) => ({
                    data: [
                      { text: item.system },
                      { text: item.accountName },
                      { text: item.reviewer },
                      { text: item.reviewDecision },
                      { text: item.noteTask },
                      { text: item.remediationStatus },
                    ],
                  })),
                }}
                minCellWidth={[300, 300, 300, 300, 300, 300]}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default CompletedStatusContent;
