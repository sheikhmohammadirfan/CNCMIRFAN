import React, { useState,useEffect } from "react";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Popover,
  makeStyles,
} from "@material-ui/core";
import Chip from "@mui/material/Chip";
import { TextControl } from "../../Utils/Control";
import DataTable from "../../Utils/DataTable/DataTable";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import MenuItem from "@mui/material/MenuItem";
import { tableMockData } from "../Accounts/AccountsColumns";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import SystemCards from "./SystemCards";


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
  systemsContainer:{
    display:"flex",
    justifyContent:"space-between",
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

    cursor:"pointer",
  },
  dataTableContainer: {
    "& > div": { maxHeight: "50vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
}));

const steps = ["Draft", "In review", "Completed"];

function UserDetails() {
  const classes = useStyle();
  const location = useLocation();
  const { id } = useParams();
  const { data } = location.state || {}; // Destructure data from state

  let activeStep = 0;
  if (data) {
    if (data.status === "Draft") {
      activeStep = 1;
    } else if (data.status === "In review") {
      activeStep = 2;
    } else if (data.status === "Completed") {
      activeStep = 3;
    }
  }

  const [value, setValue] = useState("1");
  const [searchValue, setSearchValue] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [reviewerOpen, setReviewerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [filteredData, setFilteredData] = useState(tableMockData);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };
  const handleFilter = () => {
    let data = tableMockData;
    if (selectedStatus)
      data = data.filter((item) => item.status.includes(selectedStatus));
    if (searchValue)
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    setFilteredData(data);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedStatus, searchValue]);

  return (
    <>
      <Box className={classes.usersContainer}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{
                borderBottom: "1px solid #989898",
                padding: "5px 0 20px 0",
              }}
            >
              <Box>
                <Typography noWrap variant="h5" className={classes.titleStyle}>
                  {data.name} {data.dateStarted}{" "}
                  <Chip label={data.status} variant="outlined" />
                </Typography>
              </Box>
              <Box sx={{ width: "40%" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Box className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Icon>delete</Icon>}
                  className={classes.exp_Del_Button}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Icon>download</Icon>}
                  className={classes.exp_Del_Button}
                >
                  Export
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "100%", typography: "body1"}}
        style={{marginTop:"20px"}}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Systems" value="1" />
                <Tab label="Access changes" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" style={{padding:"24px 0"}}>
                <Box className={classes.systemsContainer} width="100%">
                  <SystemCards iconName="fact_check" title="# of systems reviewed" count="1"/>
                  <SystemCards iconName="how_to_reg" title="# of accounts reviewed" count="163"/>
                  <SystemCards iconName="warning" title="# of accounts flagged" count="0"/>
                  <SystemCards iconName="manage_accounts" title="# of access changes" count="12"/>
                </Box>

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
            open={statusOpen}
            handleClose={() => setStatusOpen(false)}
            placement="bottom-start"
            options={[
              {
                text: "Draft",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Draft"),
              },
              {
                text: "Completed",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("Completed"),
              },
              {
                text: "Clear",
                clickHandler: () => handleDropdownChange(setSelectedStatus)(""),
              },
            ]}
          >
            <Button
              size="medium"
              endIcon={
                <Icon style={{ rotate: "90deg" }}>arrow_forward_ios</Icon>
              }
              className={classes.dropdownButton}
              style={{
                backgroundColor: "transparent",
                color: "#4477CE",
                textTransform: "none",
                paddingInline: 10,
                border: "none",
              }}
              onClick={() => setStatusOpen((prev) => !prev)}
            >
              {selectedStatus || "Status"}
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
                  handleDropdownChange(setSelectedReviewer)("Reviwer 1"),
              },
              {
                text: "Reviwer 2",
                clickHandler: () =>
                  handleDropdownChange(setSelectedReviewer)("Reviwer 2"),
              },
              {
                text: "Clear",
                clickHandler: () => handleDropdownChange(setSelectedReviewer)(""),
              },
            ]}
          >
            <Button
              size="medium"
              endIcon={
                <Icon style={{ rotate: "90deg" }}>arrow_forward_ios</Icon>
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
              rowData: filteredData.map((item, index) => ({
                data: [
                  { text: item.name },
                  { text: item.owner },
                  { text: item.dateStarted },
                  { text: item.status },
                ],
                
              })),
            }}
            minCellWidth={[350, 300, 350, 350]}
          />
        </Grid>
      </Grid>


            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
          </TabContext>
        </Box>

      </Box>
    </>
  );
}

export default UserDetails;
