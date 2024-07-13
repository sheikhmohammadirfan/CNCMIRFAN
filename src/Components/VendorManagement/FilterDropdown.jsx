import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  Icon,
  List,
  ListItem,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    marginTop: "6px",
    padding: "4px 0 0",
    minWidth: 200,
    maxWidth: "none",
  },
  customList: {
    fontSize: "0.8rem",
    maxHeight: 200,
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#efefef",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#dfdfdf",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#cbcbcb",
    },
  },
  listItem: {
    padding: "0 0 0 8px",
  },
  checkboxLabel: {
    width: "100%",
    color: "rgba(0, 0, 0, 0.87)",
    "&>.MuiFormControlLabel-label": {
      fontSize: "0.8rem",
    },
    "& input": {
      // Tried to style checkbox. didn't work :\
    },
  },
  checkbox: {
    color: theme.palette.primary.main,
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
  },
  clearButtonBox: {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  },
  clearButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    textTransform: "none",
    height: 25,
    width: "100%",
    "&:hover": {
      backgroundColor: "rgba(68, 119, 206, 0.85)",
    },
  },
  filterButtonIcon: {
    rotate: "90deg",
    fontSize: "0.8rem !important",
  },
  filterButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    textTransform: "none",
    paddingInline: 10,
    color: "rgba(0, 0, 0, 0.75)",
    "&[data-active='true']": {
      color: theme.palette.primary.main,
    },
    height: "39px",
    whiteSpace: "nowrap",
  },
}));

const FilterDropdown = ({
  filterName,
  buttonText,
  filterOptions,
  activeFilters = [],
  changeFilters,
  clearFilters,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Handling checkbox clicks and changing filters
  const handleCheckboxClick = (filterItem_id, filterItem_text) => {
    changeFilters(filterName, filterItem_text);
  };

  // Checking if filters are active, if yes then how many?
  let isFiltersActive = activeFilters.length !== 0;
  let activeFiltersCount = activeFilters.length;

  return (
    <Tooltip
      interactive
      placement="bottom-start"
      open={open}
      classes={{ tooltip: classes.customTooltip }}
      title={
        <Box>
          <ClickAwayListener onClickAway={handleClose}>
            <Box>
              <List disablePadding className={classes.customList}>
                {filterOptions.map((filterItem, index) => (
                  <ListItem key={index} className={classes.listItem}>
                    <FormControlLabel
                      className={classes.checkboxLabel}
                      control={
                        <Checkbox
                          size="small"
                          checked={activeFilters.includes(filterItem.text)}
                          onChange={() =>
                            handleCheckboxClick(filterItem.id, filterItem.text)
                          }
                          className={classes.checkbox}
                        />
                      }
                      label={filterItem.text}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <Box
                className={classes.clearButtonBox}
              >
                <Button
                  size="small"
                  className={classes.clearButton}
                  onClick={() => clearFilters(filterName)}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        </Box>
      }
    >
      <Button
        flexShrink={2}
        size="small"
        endIcon={
          <Icon className={classes.filterButtonIcon}>arrow_forward_ios</Icon>
        }
        className={classes.filterButton}
        onClick={() => setOpen(true)}
        data-active={isFiltersActive ? "true" : "false"}
      >
        {buttonText}
        {isFiltersActive ? ` (${activeFiltersCount})` : ""}
      </Button>
    </Tooltip>
  );
};

export default FilterDropdown;
