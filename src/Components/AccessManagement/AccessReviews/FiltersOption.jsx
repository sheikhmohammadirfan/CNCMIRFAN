import React, { useState } from "react";
import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import { TextControl } from "../../Utils/Control";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";


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


function FiltersOption() {

  const classes = useStyle();
  // const [value, setValue] = useState("1");
  const [searchValue, setSearchValue] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [reviewerOpen, setReviewerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  // const [systemOpen, setSystemOpen] = useState(false);
  // const [selectedSystem, setSelectedSytem] = useState("");
  // const [filteredData, setFilteredData] = useState(tableMockData);
  // const [anchorEl, setAnchorEl] = useState(null);




  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };

  return (
    <>

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
                clickHandler: () =>
                  handleDropdownChange(setSelectedStatus)(""),
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

    </>
  )
}

export default FiltersOption
