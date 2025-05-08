import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Typography,
  Input,
  makeStyles,
} from "@material-ui/core";
import { TextControl } from "../../Utils/Control";
import OptionDropdown from "../../RiskManagement/RiskRegister/OptionDropdown";
import DataTable from "../../Utils/DataTable/DataTable";
import {
  mockData,
  serviceOptions,
  ownerOptions,
  typeOptions,
  statusOptions,
  mfaOptions,
} from "../Accounts/AccountsColumns";
import AccessTable from "./AccessTable";
import { fetchAccounts, getAccounts } from "../../../Service/AccessManagement/Accounts";
import { post } from "../../../Service/CrudFactory";
import SkeletonBox from "../../Utils/SkeletonBox";
import { obj_to_yyyy_mm_dd } from "../../Utils/DateFormatConverter";

const useStyle = makeStyles((theme) => ({
  tableStyle: {
    // Make row cell background white
    "& tbody td": { background: "#fff" },

    // Stop overflow
    "& tbody td:not(:first-child)": { overflow: "hidden" },

    // Stick All checkbox in table to be sticky left
    "& [checkbox]": { position: "sticky !important", left: 0, zIndex: 2 },

    // Make POA&M ID column to sticky left with offset of 50px
    "& [poam-id]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },

    // Increase z-index of header
    "& [header]": {
      zIndex: "3 !important",
      "&[poam-id]": { zIndex: "2 !important" },
    },

    // Add soting
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

    // Giving box shadow on left side to First cell on select
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: "inset 4px 0 0 0 #4477CE",
    },

    // Change background color of selected row CELLS
    "& tr.Mui-selected td": {
      // background: "#8ef1f1 !important",
      background: "#e6f6f4 !important",
    },

    // Update sticky col background
    // "& thead th:nth-child(1)": { background: "#cce6e3" },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    // "& tbody td:nth-child(1)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },

    // searched data cell style
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },
  },

  titleStyle: {
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  ImportbuttonStyle: {
    textTransform: "none",
    background: theme.palette.primary.main,
    color: "white",
  },
  exportbuttonStyle: {
    textTransform: "none",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  },
  searchInput: {
    width: 300,
    "@media (max-width: 960px)": {
      flexGrow: 1,
    },
    backgroundColor: "white",
    borderRadius: 7,
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      height: 35,
    },
  },
  dropdownButton: {
    maxHeight: 32,
  },
  accessContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
    // padding: `${theme.spacing(2)-2} ${theme.spacing(2)}`,
    paddingTop: "0",
    padding: theme.spacing(2),

    // "&.zoomed": { padding: theme.spacing(3) },
  },
  dataTableContainer: {
    "& > div": { maxHeight: "60vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },
}));

function AccessAccounts() {
  const [isProductServiceOpen, setIsProductServiceOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMfa, setSelectedMfa] = useState("");

  const [loading, setLoading] = useState(false);

  const handleFilter = () => {
    let data = mockData;
    if (selectedService)
      data = data.filter((item) => item.accountName.includes(selectedService));
    if (selectedOwner)
      data = data.filter((item) => item.owner.includes(selectedOwner));
    if (selectedType)
      data = data.filter((item) => item.type.includes(selectedType));
    if (selectedStatus)
      data = data.filter((item) => item.status.includes(selectedStatus));
    if (selectedMfa)
      data = data.filter((item) => item.mfa.includes(selectedMfa));
    if (searchValue)
      data = data.filter((item) =>
        item.accountName.toLowerCase().includes(searchValue.toLowerCase())
      );
    setFilteredData(data);
  };

  useEffect(() => {
    handleFilter();
  }, [
    selectedService,
    selectedOwner,
    selectedType,
    selectedStatus,
    selectedMfa,
    searchValue,
  ]);

  const handleDropdownChange = (setter) => (value) => {
    setter(value);
  };

  const fetchAccountsData = useCallback(async () => {
    setLoading(true);
    const { data, status } = await fetchAccounts();
    if (status) {
      setFilteredData(data)
    }
    setLoading(false);
  }, [])

  useEffect(() => {
    fetchAccountsData()
  }, [fetchAccountsData])

  const classes = useStyle();
  return (
    <>
      <Box className={classes.accessContainer}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{
                borderBottom: "1px solid #989898",
                padding: "5px 0 10px 0",
              }}
            >
              <Box>
                <Typography noWrap variant="h6" className={classes.titleStyle}>
                  Accounts
                </Typography>
                <Typography noWrap variant="body2">
                  Lorem ipsum adipisicing elit. Quis, aut?
                </Typography>
              </Box>
              <Box className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  size="small"
                  className={classes.ImportbuttonStyle}
                >
                  Import access data
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.exportbuttonStyle}
                >
                  Export access data
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          margin="20px 0"
        >
          <Box display="flex" alignItems="center" gridColumnGap={10}>
            <OptionDropdown
              open={isProductServiceOpen}
              handleClose={() => setIsProductServiceOpen(false)}
              placement="bottom-start"
              options={[
                ...serviceOptions.map((option) => ({
                  text: option,
                  clickHandler: () =>
                    handleDropdownChange(setSelectedService)(option),
                })),
                {
                  text: "Clear",
                  clickHandler: () =>
                    handleDropdownChange(setSelectedService)(""),
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
                  backgroundColor: "white",
                  color: "#4477CE",
                  textTransform: "none",
                  paddingInline: 10,
                  border: "1px solid #4477CE",
                }}
                onClick={() => setIsProductServiceOpen((prev) => !prev)}
              >
                {selectedService || "Service"}
              </Button>
            </OptionDropdown>

            <OptionDropdown
              open={ownerOpen}
              handleClose={() => setOwnerOpen(false)}
              placement="bottom-start"
              options={[
                ...ownerOptions.map((option) => ({
                  text: option,
                  clickHandler: () =>
                    handleDropdownChange(setSelectedOwner)(option),
                })),
                {
                  text: "Clear",
                  clickHandler: () =>
                    handleDropdownChange(setSelectedOwner)(""),
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
                onClick={() => setOwnerOpen((prev) => !prev)}
              >
                {selectedOwner || "Owner"}
              </Button>
            </OptionDropdown>

            <OptionDropdown
              open={typeOpen}
              handleClose={() => setTypeOpen(false)}
              placement="bottom-start"
              options={[
                ...typeOptions.map((option) => ({
                  text: option,
                  clickHandler: () =>
                    handleDropdownChange(setSelectedType)(option),
                })),
                {
                  text: "Clear",
                  clickHandler: () => handleDropdownChange(setSelectedType)(""),
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
                onClick={() => setTypeOpen((prev) => !prev)}
              >
                {selectedType || "Type"}
              </Button>
            </OptionDropdown>

            <OptionDropdown
              open={statusOpen}
              handleClose={() => setStatusOpen(false)}
              placement="bottom-start"
              options={[
                ...statusOptions.map((option) => ({
                  text: option,
                  clickHandler: () =>
                    handleDropdownChange(setSelectedStatus)(option),
                })),
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
              open={mfaOpen}
              handleClose={() => setMfaOpen(false)}
              placement="bottom-start"
              options={[
                ...mfaOptions.map((option) => ({
                  text: option,
                  clickHandler: () =>
                    handleDropdownChange(setSelectedMfa)(option),
                })),
                {
                  text: "Clear",
                  clickHandler: () => handleDropdownChange(setSelectedMfa)(""),
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
                onClick={() => setMfaOpen((prev) => !prev)}
              >
                {selectedMfa || "MFA"}
              </Button>
            </OptionDropdown>
          </Box>

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
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Box>
        </Box>

        {loading ?
          <SkeletonBox text="Loading Accounts..." height='60vh' width='100%' /> :
          <Grid container spacing={1}>
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
                    { text: "Account Name" },
                    { text: "Owner" },
                    { text: "Groups" },
                    { text: "Type" },
                    { text: "Status" },
                    { text: "MFA" },
                    { text: "Created" },
                  ],
                }}
                rowList={{
                  rowData: filteredData.map((item) => ({
                    data: [
                      { text: item.account_name },
                      { text: item.account_owner },
                      { text: "No group in response" },
                      { text: "No type in response" },
                      { text: item.status },
                      { text: item.mfa },
                      { text: obj_to_yyyy_mm_dd(new Date(item.date_added)) },
                    ],
                  })),
                }}
                minCellWidth={[350, 200, 150, 250, 150, 150, 150]}
              />
            </Grid>
          </Grid>
        }
      </Box>
    </>
  );
}

export default AccessAccounts;
