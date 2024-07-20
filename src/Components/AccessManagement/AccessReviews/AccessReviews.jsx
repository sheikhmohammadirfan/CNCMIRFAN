import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  makeStyles,
  InputLabel,
  TextField,
  Divider,
  Chip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TextControl } from "../../Utils/Control";
import DataTable from "../../Utils/DataTable/DataTable";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import MenuItem from "@mui/material/MenuItem";
import { tableMockData } from "../Accounts/AccountsColumns";
import DoughnutChart from "./DoughnutChart";

const useStyle = makeStyles((theme) => ({
  reviewsContainer: {
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
  titleStyle: {
    fontWeight: "bold",
  },
  CreatebuttonStyle: {
    textTransform: "none",
    background: theme.palette.primary.main,
    color: "white",
  },
  riskTodoBox: {
    marginTop: "20px",
    width: "50%",
    height: "250px",
    backgroundColor: "white",
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
    "& > div": { maxHeight: "60vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
  closeBox: {
    borderRight: "1px solid #989898",
    paddingRight: "15px",
    width: "max-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20px",
  },
  dialogTitle: {
    borderBottom: "1px solid #989898",
  },
  createRevBtn: {
    textTransform: "none",
    backgroundColor: "#4477CE",
    color: "white",
  },
  createRevContainer:{
    // backgroundColor:"pink",
    marginTop:"20px",
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
  textField: {
    '& .MuiInputBase-root': {
      height: "35px",
    },
  },
}));

const getRiskChip = (risk) => {
  switch (risk) {
    case 'High':
      return (
        <Chip
          variant="outlined"
          label="High"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"red"}}>keyboard_double_arrow_up</Icon>}
        />
      );
    case 'Medium':
      return (
        <Chip
        variant="outlined"
          label="Medium"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"yellow"}}>remove</Icon>}
        />
      );
    case 'Low':
      return (
        <Chip
        variant="outlined"
          label="Low"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"green"}}>keyboard_double_arrow_down</Icon>}
        />
      );
    default:
      return <Chip label={risk} />;
  }
};

const getStatusChip = (status) => {
  switch (status) {
    case 'Completed':
      return (
        <Chip
          variant="outlined"
          label="Completed"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"green"}}>radio_button_checked</Icon>}
        />
      );
    case 'In Review':
      return (
        <Chip
        variant="outlined"
          label="In Review"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"yellow"}}>radio_button_checked</Icon>}
        />
      );
    case 'Draft':
      return (
        <Chip
        variant="outlined"
          label="Draft"
          style={{minWidth:"100px"}}
          icon={<Icon style={{color:"gray"}}>radio_button_checked</Icon>}
        />
      );
    default:
      return <Chip label={status} />;
  }
};

function AccessReviews() {
  const classes = useStyle();
  const history = useHistory();
  const createBtnRef = useRef(null);
  const [openCreatePopper, setOpenCreatePropper] = useState(false);
  const [createAccess, setCreateAccess] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(tableMockData);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [reviewerOpen, setReviewerOpen]=useState(false)
  const [selectedReviewer, setSelectedReviewer]=useState("")
  const [inherentRiskOpen, setInherentRiskOpen]=useState(false)
  const [selectedInherentRisk, setSelectedInherentRisk]=useState("")
  const [accessIntegrationOpen, setAccessIntegrationOpen]=useState(false)
  const [selectedAccessIntegration, setSelectedAccessIntegration]=useState("")
  const [open, setOpen] = useState(false);


//Dropdown options data
const reviewerOptions = [
  { text: 'Reviewer_1', value: 'Reviewer_1' },
  { text: 'Reviewer_2', value: 'Reviewer_2' },
  { text: 'Clear', value: '' },
];

const inherentRiskOptions = [
  { text: 'Low', value: 'Low' },
  { text: 'Medium', value: 'Medium' },
  { text: 'High', value: 'High' },
  { text: 'Clear', value: '' },
];

const accessIntegrationOptions = [
  { text: 'Yes', value: 'Yes' },
  { text: 'No', value: 'No' },
  { text: 'Clear', value: '' },
];

const riskData = {
  labels: ["Critical", "High", "Medium", "Low", "Unscored"],
  datasets: [
    {
      data: [2, 16, 9, 1, 1],
      backgroundColor: ["red", "orange", "gold", "green", "#A9A9A9"],
      borderColor: ["red", "orange", "gold", "green", "#A9A9A9"],
      borderWidth: 1,
    },
  ],
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

  const handleCreateAccessChange = (event) => {
    setCreateAccess(event.target.value);
  };

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };

  const handleRowClick = (rowId) => {
    console.log("Row Clicked");
    const selectedItem = filteredData[rowId];
    history.push(`/access_management/reviews/user-details/${rowId}`, {
      data: selectedItem,
    });
  };

  const handleShowCreateReview = () => {
    setShowCreateReview(true);
  };

  const handleHideCreateReview = () => {
    setShowCreateReview(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={classes.reviewsContainer}>
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
                Access Reviews
              </Typography>
            </Box>
            <Box className={classes.buttonContainer}>
              <Button
                // onClick={handleShowCreateReview}
                onClick={handleClickOpen}
                size="small"
                variant="contained"
                color="primary"
                startIcon={<Icon>add</Icon>}
              >
                Create Review
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

<Box mt={2} style={{ display: "flex", justifyContent: "space-between" }}>
      <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={6}>
            <Box border={1} p={2}>
              <Typography variant="h6">Access review progress</Typography>
            </Box>
            <Box borderBottom={1} borderRight={1} borderLeft={1} p={2}>
              <DoughnutChart data={riskData} />
            </Box>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <Box border={1} p={2}>
              <Typography variant="h6">To-do list</Typography>
            </Box>
            <Box
              borderBottom={1}
              borderRight={1}
              borderLeft={1}
              overflowY="scroll"
              height="183px"
            >
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Complete access review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Apr 18</Typography>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Start review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Jun 3</Typography>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignContent="center"
                justifyContent="space-between"
                width="100%"
                height="33%"
                sx={{ textTransform: "none" }}
              >
                <Box p={2}>
                  <Typography align="left">Complete review</Typography>
                </Box>
                <Box p={2}>
                  <Typography>Due Jun 17</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
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
                text: "In review",
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)("In review"),
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
                { text: "Name" },
                { text: "Owner" },
                { text: "Date Started" },
                { text: "Date Completed" },
                { text: "Status" },
              ],
            }}
            rowList={{
              rowData: filteredData.map((item, index) => ({
                data: [
                  { text: item.name },
                  { text: item.reviewer },
                  { text: item.dateStarted },
                  { text: item.dateCompleted },
                  {
                    text: getStatusChip(item.status)
                  },
                ],
                props: { onClick: () => handleRowClick(index) }, // Adding onClick here
              })),
            }}
            minCellWidth={[300, 200, 250, 250, 250]}
          />
        </Grid>
      </Grid>

      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Box className={classes.closeBox}>
                <Button onClick={handleClose}>
                  <Icon>close</Icon>
                </Button>
              </Box>

              <Typography variant="h6">Creating a Review</Typography>
              <Icon style={{ fontSize: "16px", color: "#4477ce" }}>info</Icon>
            </Box>
            <Box>
              <Button variant="contained" className={classes.createRevBtn}>
                Create draft review
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className={classes.createRevContainer}>
            <Box style={{display:"flex", flexDirection:"column", gap:"10px", borderBottom:"1px solid #989898", paddingBottom:"20px"}}>
              <InputLabel htmlFor="rev_name">Review name</InputLabel>
              <TextField id="rev_name" name="rev_name" variant="outlined" className={classes.textField} fullWidth></TextField>
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
                  open={reviewerOpen}
                  handleClose={() => setReviewerOpen(false)}
                  placement="bottom-start"
                  options={reviewerOptions.map((option) => ({
                    text: option.text,
                    clickHandler: () => handleDropdownChange(setSelectedReviewer)(option.value),
                  }))}
              >
              <Button
                size="medium"
                endIcon={<Icon style={{ transform: 'rotate(90deg)' }}>arrow_forward_ios</Icon>}
                style={{
                  backgroundColor: 'transparent',
                  color: '#4477CE',
                  textTransform: 'none',
                  paddingInline: 10,
                  border: 'none',
                }}
                onClick={() => setReviewerOpen((prev) => !prev)}
              >
                {selectedReviewer || 'Reviewer'}
              </Button>
            </OptionDropdown>

            <OptionDropdown
              open={inherentRiskOpen}
              handleClose={() => setInherentRiskOpen(false)}
              placement="bottom-start"
              options={inherentRiskOptions.map((option) => ({
                text: option.text,
                clickHandler: () => handleDropdownChange(setSelectedInherentRisk)(option.value),
              }))}
            >
            <Button
              size="medium"
              endIcon={<Icon style={{ transform: 'rotate(90deg)' }}>arrow_forward_ios</Icon>}
              style={{
                backgroundColor: 'transparent',
                color: '#4477CE',
                textTransform: 'none',
                paddingInline: 10,
                border: 'none',
              }}
              onClick={() => setInherentRiskOpen((prev) => !prev)}
            >
              {selectedInherentRisk || 'Inherent Risk'}
            </Button>
          </OptionDropdown>

          <OptionDropdown
            open={accessIntegrationOpen}
            handleClose={() => setAccessIntegrationOpen(false)}
            placement="bottom-start"
            options={accessIntegrationOptions.map((option) => ({
              text: option.text,
              clickHandler: () => handleDropdownChange(setSelectedAccessIntegration)(option.value),
            }))}
          >
            <Button
              size="medium"
              endIcon={<Icon style={{ transform: 'rotate(90deg)' }}>arrow_forward_ios</Icon>}
              style={{
                backgroundColor: 'transparent',
                color: '#4477CE',
                textTransform: 'none',
                paddingInline: 10,
                border: 'none',
              }}
              onClick={() => setAccessIntegrationOpen((prev) => !prev)}
            >
              {selectedAccessIntegration || 'Access Integration'}
            </Button>
          </OptionDropdown>
            </Box>
          </Box>
          <Grid container spacing={1} className={classes.dataTableContainer}>
            <Grid item xs={12}>
              <DataTable
                className={classes.tableStyle}
                checkbox={true}
                serialNo={false}
                stickyHeader={true}
                verticalBorder={true}
                resizeTable={true}
                header={{
                  data: [
                    { text: "System" },
                    { text: "Reviewer" },
                    { text: "Inherent Risk" },
                    { text: "Integration Status" },
                    ],
                  }}
                  rowList={{
                    rowData: filteredData.map((item, index) => ({
                      data: [
                        { text: item.system },
                        { text: item.reviewer },
                        {
                          text: getRiskChip(item.inherentRisk)
                        },
                        { text: item.integrationStatus },
                      ]
                    })),
                  }}
                  minCellWidth={[350, 350, 350, 350]}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AccessReviews;
