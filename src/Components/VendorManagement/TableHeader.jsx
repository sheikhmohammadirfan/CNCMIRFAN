import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  makeStyles,
  useMediaQuery,
  useTheme,
  ButtonGroup,
} from "@material-ui/core";
import React, { useState } from "react";
import { TextControl } from "../Utils/Control";
import FilterDropdown from "./FilterDropdown";
import ManageColumns from "./ManageColumns";

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
      height: 40,
    },
  },
  actionButton: {
    "&.Mui-disabled": {
      color: "rgba(68, 119, 206, 0.5) !important",
    },
    "&.Mui-disabled img": {
      opacity: 0.4,
    },
    maxHeight: 34,
    backgroundColor: "white",
    color: "#4477CE",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    paddingInline: 10,
    textTransform: "none",
  },
  dropdownButton: {
    maxHeight: 32,
  },

  tableHeader: {
      overflow: "auto",
      borderRadius: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: "#fff",
      borderBottom: "none",
      "& .MuiButton-startIcon": {
        marginRight: !theme.breakpoints.up("md") && 0,
        marginLeft: !theme.breakpoints.up("md") && 0,
      },
      "& .MuiButton-root": {
        padding: theme.breakpoints.up("md") && "6px 16px",
      },
      borderColor: "#d9d9d9",
    }
}));

const TableHeader = ({
  tableFilters,
  activeFilters,
  changeFilters,
  clearFilters,
  selectedRows,
  cols: { allColumns, visibleColumns, hideColumn, showColumn },
  searchValue,
  updateSearch,
  headerButtons = [],
}) => {
  const classes = useStyle();

  // State to toggle Manage Columns dropdown
  const [ismanageColsOpen, setManageColsOpen] = useState(false);
  const openManageColsDropdown = () => setManageColsOpen(true);
  const closeManageColsDropdown = () => setManageColsOpen(false);

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      {/* FILTERS */}
      {/* Contains 2 Boxes, 1 for filters, and 2nd for a dropdown to show and hide columns */}
      <Box
        mt={2}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingY={1}
        paddingX={1}
        padding={1}
        border={1}
        className={classes.tableHeader}
      >
        {/* Filters */}

        <Box display={"flex"} gridColumnGap={8} alignItems={"center"} mr={4}>
          {/* Contains search text field, and two dropdowns i.e. More and Share */}
          <Box>
            {/* Search field */}
            <TextControl
              variant="outlined"
              placeholder="Search vendors"
              size="small"
              gutter={false}
              label=" "
              className={classes.searchInput}
              value={searchValue}
              onChange={updateSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchValue ? (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          updateSearch({ target: { value: "" } });
                        }}
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    ) : (
                      <Icon color="primary">search</Icon>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <ButtonGroup>
            {headerButtons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                disabled={button.disabled}
                className={classes.actionButton}
              >
                {button.label}
              </Button>
            ))}
          </ButtonGroup>
          {Object.values(tableFilters)
            .sort((a, b) => a.order - b.order)
            .map((filter, index) => (
              <FilterDropdown
                key={index}
                filterName={filter.name}
                buttonText={filter.text}
                filterOptions={filter.options}
                activeFilters={activeFilters[filter.name]}
                changeFilters={changeFilters}
                clearFilters={clearFilters}
              />
            ))}
        </Box>

        {/* Dropdown to show and hide columns */}
        <Box mr={0}>
          <ManageColumns
            open={ismanageColsOpen}
            handleClose={closeManageColsDropdown}
            cols={{ allColumns, visibleColumns, hideColumn, showColumn }}
          >
            <Button
              onClick={openManageColsDropdown}
              endIcon={<Icon>tune</Icon>}
              className={classes.actionButton}
            >
              {aboveMd && "Columns"}
            </Button>
          </ManageColumns>
        </Box>
      </Box>
    </>
  );
};

export default TableHeader;
