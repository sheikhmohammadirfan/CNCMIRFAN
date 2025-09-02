import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import FilterDropdown from "../../Utils/DataTable/FilterDropdown";
import { TextControl } from "../../Utils/Control";
import colorShader from "../../Utils/ColorShader";
import jira from "../../../assets/img/jira-brands.svg";
import { FILTER_HANDLERS } from "./ActionTrackerUtils";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import JiraIssueDialog from "../../Jira/jiraIssueFormDialog";

// Generate Styles
const useStyle = makeStyles((theme) => ({
  searchInput: {
    width: 300,
    "@media (max-width: 960px)": {
      flexGrow: 1,
    },
    backgroundColor: "white",
    borderRadius: 7,
    borderRight: 0,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      height: 35,
    },
    // overflow: "hidden"
  },

  outlineButton: {
    "&.Mui-disabled": {
      color: `${colorShader("#4477CE", 0.5)} !important`,
    },
    "&.Mui-disabled img": {
      opacity: 0.4,
    },
    maxHeight: 34,
    backgroundColor: "white",
    color: theme.palette.primary.main,
    border: "1px solid rgba(0, 0, 0, 0.2)",
    paddingInline: 10,
    textTransform: "none",
  },

  addActionButton: {
    "&.Mui-disabled": {
      backgroundColor: `${colorShader(
        theme.palette.primary.main,
        0.6
      )} !important`,
    },
    "&.Mui-disabled img": {
      opacity: 0.4,
    },
    maxHeight: 34,
    color: "#FFFFFF !important",
    paddingInline: 10,
    textTransform: "none",
    transition: "color 0s",
  },

  actionButton: {
    fontSize: "0.8rem",
    backgroundColor: colorShader(theme.palette.primary.main, 0.05),
    "&:hover": {
      backgroundColor: colorShader(theme.palette.primary.main, 0.1),
    },
    borderRadius: 5,
    color: theme.palette.primary.main,
    textTransform: "none",
    "&.MuiButton-root": {
      "@media (max-width: 960px)": {
        minWidth: "50px",
      },
    },
    "& .MuiButton-endIcon": {
      "@media (max-width: 960px)": {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  },
}));

const ActionTrackerHeader = ({
  hasAccess,
  tableFilters,
  filters: { filters, changeFilters, clearFilters },
  triggerFilters,
  selectedRows,
  openAddActionForm,
  openDeleteConfirmationDialog,
  onSearch,
  openExportDialog,
}) => {
  // State to control search value
  const [searchValue, setSearchValue] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // hook to Jira open / close status of Jira column
  // const [isJiraOpen, setIsJiraOpen] = useState(false);
  // const openJira = () => setIsJiraOpen(true);
  // const closeJira = () => setIsJiraOpen(false);
  const updateSearch = (e) => {
    const searchedValue = e.target.value;
    setSearchValue(searchedValue);
  };

  const handleAddActionClose = () => {
    setAnchorEl(null);
  };
  const handleAddActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDialogOpen = () => {
    setAnchorEl(null)
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up("md"));

  const classes = useStyle();

  return (
    <>
      <JiraIssueDialog
        open={openDialog}
        onClose={handleDialogClose}
        // rowId="1234"
      />
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" gridColumnGap={8}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              color="primary"
              startIcon={<Icon>add</Icon>}
              className={classes.addActionButton}
              onClick={handleAddActionClick}
              disabled={!hasAccess || selectedRows.length > 0}
            >
              Add
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleAddActionClose}
            >
              <MenuItem
                onClick={() => {
                  openAddActionForm();
                  handleAddActionClose();
                }}
              >
                Custom Action
              </MenuItem>
              <MenuItem onClick={handleDialogOpen}>Jira Action</MenuItem>
            </Menu>

            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Icon>edit</Icon>}
              className={classes.outlineButton}
              disabled={selectedRows.length !== 1}
              onClick={openAddActionForm}
            >
              Edit
            </Button>

            <Tooltip
              placement="bottom-start"
              title={!hasAccess && "You don't have write access!"}
            >
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<Icon>delete</Icon>}
                  className={classes.outlineButton}
                  disabled={!hasAccess || selectedRows.length !== 1}
                  onClick={() => openDeleteConfirmationDialog()}
                  style={{ height: "100%" }}
                >
                  Delete
                </Button>
              </span>
            </Tooltip>
          </Box>
          {/* Search field and 'add task', 'download csv' button */}
          <Box display="flex" gridColumnGap={8}>
            <TextControl
              variant="outlined"
              placeholder="Search Task (Press Enter)"
              size="small"
              gutter={false}
              label=" "
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchValue ? (
                      <IconButton
                        size="small"
                        color="#4477CE"
                        onClick={() => {
                          updateSearch({ target: { value: "" } });
                        }}
                        style={{ color: "#4477CE" }}
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    ) : (
                      <Icon style={{ color: "#4477CE" }}>search</Icon>
                    )}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="absolute"
                    style={{ position: "absolute", right: -6 }}
                  >
                    {searchValue && (
                      <>
                        <IconButton
                          size="small"
                          color="inherit"
                          disabled={false}
                          // onClick={() => setSelected((prev) => prev - 1)}
                        >
                          <Icon>arrow_left</Icon>
                        </IconButton>
                        <IconButton
                          size="small"
                          color="inherit"
                          disabled={false}
                          // onClick={() => setSelected((prev) => prev + 1)}
                        >
                          <Icon>arrow_right</Icon>
                        </IconButton>
                      </>
                    )}
                  </InputAdornment>
                ),
              }}
              // value={}
              // onChange={}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  onSearch(e.target.value);
                }
              }}
            />

            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Icon>arrow_downward</Icon>}
              className={classes.outlineButton}
              // disabled={selectedRows.length !== 1}
              onClick={openExportDialog}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        <Box
          mt={2}
          display={"flex"}
          justifyContent={"space-between"}
          paddingY={1}
          paddingX={1}
          padding={1}
          border={1}
          sx={{
            borderRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: "#fff",
            borderBottom: "none",
            "& .MuiButton-startIcon": {
              marginRight: !aboveMd && 0,
              marginLeft: !aboveMd && 0,
            },
            "& .MuiButton-root": {
              padding: aboveMd && "6px 16px",
            },
            borderColor: "#d9d9d9",
          }}
        >
          {/* Filters */}
          <Box display={"flex"} gridColumnGap={8}>
            {Object.values(tableFilters)
              .sort((a, b) => a.order - b.order)
              .map((filter, index) => (
                <FilterDropdown
                  key={index}
                  filterName={filter.name}
                  buttonText={filter.text}
                  filterOptions={filter.options}
                  activeFilters={filters[filter.name]}
                  changeFilters={changeFilters}
                  clearFilters={clearFilters}
                  trigger={triggerFilters}
                  filterHandlerMap={FILTER_HANDLERS}
                />
              ))}
          </Box>

          <Box display="flex" gridColumnGap={8}>
            <Button
              variant="contained"
              disableElevation
              className={classes.actionButton}
              startIcon={
                <Icon style={{ opacity: selectedRows.length > 0 ? 1 : 0.4 }}>
                  upload_file
                </Icon>
              }
            >
              Upload File
            </Button>
            <Button
              variant="contained"
              disableElevation
              className={classes.actionButton}
              startIcon={
                <Icon style={{ opacity: selectedRows.length > 0 ? 1 : 0.4 }}>
                  mail
                </Icon>
              }
            >
              Send Reminder
            </Button>
            <Button
              variant="contained"
              disableElevation
              className={classes.actionButton}
            >
              <img
                src={jira}
                alt="JIRA"
                style={{
                  height: "20px",
                  marginRight: aboveMd ? 8 : 0,
                  opacity: selectedRows.length > 0 ? 1 : 0.5,
                }}
              />
              Sync to Jira
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ActionTrackerHeader;
