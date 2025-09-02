import { Box, Button, Checkbox, ClickAwayListener, Divider, FormControlLabel, Grid, Icon, List, ListItem, Tooltip, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import colorShader from '../ColorShader';
import { DateControl } from '../Control';
import { notification } from '../Utils';

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    backgroundColor: "white",
    border: `1px solid ${colorShader('#000000', 0.1)}`,
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
      width: "7px"
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#efefef",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#dfdfdf",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#cbcbcb",
    }
  },
  listItem: {
    padding: "0 0 0 8px",
    flexDirection: "column"
  },
  checkboxLabel: {
    width: "100%",
    color: colorShader('#000000', 0.87),
    "&>.MuiFormControlLabel-label": {
      fontSize: "0.8rem",
    },
    "& input": {
      // Tried to style checkbox. didn't work :\
    }
  },
  checkbox: {
    color: theme.palette.primary.main,
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    }
  },
  actionButton: {
    textTransform: 'none',
    height: 25,
    width: "100%",
  },
  secondaryActionBtn: {
    backgroundColor: colorShader(theme.palette.primary.main, 0.15),
    '&:hover': {
      backgroundColor: colorShader(theme.palette.primary.main, 0.2),
    }
  },
  submitButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: colorShader(theme.palette.primary.main, 0.85)
    },
    "&:disabled": {
      color: "white",
      opacity: 0.75
    }
  },
  filterButtonIcon: {
    rotate: '90deg',
    fontSize: '0.8rem !important',
  },
  filterButton: {
    backgroundColor: colorShader('#000000', 0.05),
    textTransform: "none",
    paddingInline: 10,
    color: colorShader('#000000', 0.75),
    "&[data-active='true']": {
      color: theme.palette.primary.main
    }
  },
  dateContainer: {
    paddingBottom: 12,
    gap: 12,
    "& .MuiInputBase-root": {
      fontSize: "inherit",
      marginTop: 0
    },
    "& .MuiInputAdornment-root .material-icons": {
      fontSize: 16
    },
    "& .MuiFormLabel-root": {
      display: "none"
    },
    "& .showLabel .MuiInputBase-root": {
      marginTop: 16
    },
    "& .showLabel .MuiFormLabel-root": {
      display: "initial"
    }
  }
}))

const FilterDropdown = ({
  // String
  filterName,
  // String
  buttonText,
  // Array of objects. objects shoould contain keys "id" and "text"
  filterOptions,
  // Array of ids. if this array contains some id that is inside filterOptions array, that option will be checked
  activeFilters,
  // Functions that are responsible to change the "activeFilters" array. 
  // activeFilters should be associated with a useState to be able to see the check uncheck behavious
  changeFilters,
  clearFilters,
  trigger = () => { },
  contextLoading = false,
  filterHandlerMap = {},
  filterMetadata = {},
  dropdownPlacement,
  buttonStyles = {}
}) => {

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [internalActiveFilters, setInternalActiveFilters] = useState(activeFilters);
  useEffect(() => {
    setInternalActiveFilters(activeFilters);
  }, [open]);

  const [dateInput, setDateInput] = useState([null, null]);
  useEffect(() => {
    const dateFilterOption = filterOptions.find(f => !!f.showDateRange);
    if (dateFilterOption && internalActiveFilters.includes(dateFilterOption.id)) {
      if (filterMetadata?.[filterName]?.[dateFilterOption.id]) {
        const { fromDate, toDate } = filterMetadata[filterName][dateFilterOption.id];
        setDateInput([fromDate, toDate]);
      }
    }
  }, [internalActiveFilters]);

  // Handling checkbox clicks and changing filters
  const handleCheckboxClick = (filterItem_id) => {
    setInternalActiveFilters(prev => filterName in filterHandlerMap
      ? filterHandlerMap[filterName](prev, filterItem_id)
      : (prev.includes(filterItem_id))
        ? prev.filter(id => id !== filterItem_id)
        : [...prev, filterItem_id]
    )
  }

  // Handle submit button click
  const handleClearBtnClick = () => {
    setInternalActiveFilters([]);
  }

  // Handle submit button click
  const handleSubmitBtnClick = () => {
    const dateFilterOption = filterOptions.find(f => !!f.showDateRange);
    if (dateFilterOption && internalActiveFilters.includes(dateFilterOption.id)) {
      if (dateInput[0] === null || dateInput[1] === null) {
        notification("err", "Select valid date range", "error");
        return;
      }
    }
    changeFilters(filterName, internalActiveFilters, dateInput);
    trigger(false, true);
    handleClose();
  }

  // Checking if filters are active, if yes then how many?
  let isFiltersActive = activeFilters.length !== 0;
  let activeFiltersCount = activeFilters.length

  return (
    <Tooltip
      interactive
      placement={dropdownPlacement || 'bottom-start'}
      open={open}
      classes={{ tooltip: classes.customTooltip }}
      title={
        <Box>
          <ClickAwayListener onClickAway={handleClose}>
            <Box>
              <List
                disablePadding
                className={classes.customList}
              >
                {filterOptions
                  .map((filterItem, index) => (
                    <ListItem key={index} className={classes.listItem}>
                      <FormControlLabel
                        className={classes.checkboxLabel}
                        control={
                          <Checkbox
                            size='small'
                            checked={internalActiveFilters.includes(filterItem.id)}
                            onChange={() => handleCheckboxClick(filterItem.id)}
                            className={classes.checkbox}
                          />
                        }
                        label={filterItem.text}
                      />
                      {!!filterItem.showDateRange &&
                        internalActiveFilters.includes(filterItem.id) &&
                        <Box
                          display="flex"
                          flexDirection="column"
                          className={classes.dateContainer}>
                          <DateControl
                            size="small"
                            name="fromDate"
                            label="From"
                            placeholder="From Date"
                            className={dateInput[0] ? "showLabel" : ""}
                            value={dateInput[0]}
                            onChange={v => setDateInput([v, dateInput[1]])}
                            maxDate={dateInput[1] || undefined}
                            clearable={true}
                          />
                          <DateControl
                            size="small"
                            name="toDate"
                            label="To"
                            placeholder="To Date"
                            className={dateInput[1] ? "showLabel" : ""}
                            value={dateInput[1]}
                            onChange={v => setDateInput([dateInput[0], v])}
                            minDate={dateInput[0] || undefined}
                            clearable={true}
                          />
                        </Box>}
                    </ListItem>
                  ))}
              </List>
              <Divider />

              <Grid container spacing={1} style={{ padding: '10px' }}>
                <Grid item xs={6}>
                  <Button
                    color='primary'
                    className={`${classes.actionButton} ${classes.secondaryActionBtn}`}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    color='primary'
                    className={`${classes.actionButton} ${classes.secondaryActionBtn}`}
                    onClick={handleClearBtnClick}
                  >
                    Clear
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    size='small'
                    className={`${classes.actionButton} ${classes.submitButton}`}
                    onClick={handleSubmitBtnClick}
                    disabled={JSON.stringify(activeFilters) === JSON.stringify(internalActiveFilters)}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </ClickAwayListener>
        </Box>
      }
    >
      <Button
        size='small'
        endIcon={<Icon className={classes.filterButtonIcon}>arrow_forward_ios</Icon>}
        className={classes.filterButton}
        onClick={() => setOpen(true)}
        data-active={isFiltersActive ? "true" : "false"}
        disabled={contextLoading}
        style={{ ...buttonStyles }}
      >
        {buttonText}
        {isFiltersActive ? ` (${activeFiltersCount})` : ""}
      </Button>
    </Tooltip>
  )
}

export default FilterDropdown