
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
  makeStyles
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TextControl } from "../../Utils/Control";
import DataTable from "../../Utils/DataTable/DataTable";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import MenuItem from "@mui/material/MenuItem";
import { tableMockData } from "../Accounts/AccountsColumns";


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
    cursor:"pointer",
  },
  dataTableContainer: {
    "& > div": { maxHeight: "50vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
  
}));

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
    console.log("Row Clicked")
    const selectedItem = filteredData[rowId];
    history.push(`/access-management/reviews/user-details/${rowId}`, { data: selectedItem });
  };

  const handleShowCreateReview = () => {
    setShowCreateReview(true);
  };

  const handleHideCreateReview = () => {
    setShowCreateReview(false);
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
                onClick={handleShowCreateReview}
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

      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Box className={classes.riskTodoBox}>


        </Box>
        <Box className={classes.riskTodoBox}></Box>
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
                  { text: item.owner },
                  { text: item.dateStarted },
                  { text: item.dateCompleted },
                  { text: item.status },
                ],
                props: { onClick: () => handleRowClick(index) }, // Adding onClick here
              })),
            }}
            minCellWidth={[350, 200, 250, 250, 250]}
          />
        </Grid>
      </Grid>

      {showCreateReview && (
        <Box className={classes.createReviewBox}>
          <Typography variant="h6" className={classes.titleStyle}>
            Create Review
          </Typography>
          <TextControl
            autoFocus
            variant="outlined"
            placeholder="Review Name"
            size="small"
            label=" "
            value={createAccess}
            onChange={handleCreateAccessChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleHideCreateReview}
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default AccessReviews;
