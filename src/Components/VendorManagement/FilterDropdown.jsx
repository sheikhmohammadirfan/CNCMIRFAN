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
  Slider,
  Tooltip,
  makeStyles,
  Input,
  Grid,
} from "@material-ui/core";
import colorShader from '../Utils/ColorShader';
import React, { useState, useEffect } from "react";
import { DateControl } from "../Utils/Control";

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
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: 60,
  },
  dateContainer: {
    paddingBottom: 12,
    gap: 12,
    display: "flex",
    flexDirection: "column",
    "& .MuiInputBase-root": {
      fontSize: "0.8rem",
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
  },
}));

const FilterDropdown = ({
  filterName,
  buttonText,
  filterOptions,
  activeFilters = [],
  changeFilters,
  clearFilters,
  filterMetadata = {},
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [dateInput, setDateInput] = useState([null, null]);

  useEffect(() => {
    if (filterName === "accounts" && activeFilters.length === 0) {
      setSliderValue(0);
    }
    if (filterMetadata?.date?.[3]) {
      const { fromDate, toDate } = filterMetadata.date[3];
      setDateInput([fromDate, toDate]);
    }
  }, [filterMetadata, activeFilters, filterName]);

  const handleClose = () => setOpen(false);

  // Handling checkbox clicks and changing filters
  const handleCheckboxClick = (filterItem_id, filterItem_text) => {
    changeFilters(filterName, filterItem_text, dateInput, sliderValue);
  };

  // Handling slider changes
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    changeFilters(filterName, newValue);
  };

  // Handling input changes
  const handleInputChange = (event) => {
    let value = event.target.value === '' ? '' : Number(event.target.value);
    if (value > 100) value = 100;
    setSliderValue(value);
    changeFilters(filterName, [value]);
  };

  // Handling input blur
  const handleBlur = () => {
    if (sliderValue > 100) {
      setSliderValue(100);
      changeFilters(filterName, 100);
    } else {
      clearFilters(filterName);
    }
  };  

  const handleClearBtnClick = () => {
    if (filterName === "date") {
      setDateInput([null, null]);
      clearFilters(filterName);
    } else if (filterName === "accounts") {
      setSliderValue([0, 100]);
      clearFilters(filterName);
    } else {
      clearFilters(filterName);
    }
  };  

  const handleSubmitBtnClick = () => {
    changeFilters(filterName, activeFilters, dateInput);
    handleClose();
  };

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
              {filterName === "date" ? (
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
                  {activeFilters.includes("Custom") && (
                    <Box px={1} className={classes.dateContainer}>
                      <DateControl
                        size="small"
                        name="fromDate"
                        label="From"
                        placeholder="From Date"
                        value={dateInput[0]}
                        onChange={(v) => setDateInput([v, dateInput[1]])}
                        maxDate={dateInput[1] || undefined}
                        clearable={true}
                      />
                      <DateControl
                        size="small"
                        name="toDate"
                        label="To"
                        placeholder="To Date"
                        value={dateInput[1]}
                        onChange={(v) => setDateInput([dateInput[0], v])}
                        minDate={dateInput[0] || undefined}
                        clearable={true}
                      />
                    </Box>
                  )}
                </Box>
              ) : filterName === "accounts" ? (
                <Box px={2} py={2} className={classes.sliderContainer}>
                  <Box width={150} mr={4}>
                    <Slider
                      value={sliderValue}
                      onChange={handleSliderChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 100, label: '100+' },
                      ]}
                    />
                  </Box>
                  <Box>
                    <Input
                      className={classes.input}
                      value={sliderValue}
                      margin="dense"
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: 'number',
                      }}
                    />
                  </Box>
                </Box>
              )  : filterName === "date" ? (
                <Box px={2} py={2}>
                  <DateControl
                    name="date"
                    label="Date"
                    variant='outlined'
                    fullWidth
                  />
                </Box>
              ) : (
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
              )}
              <Divider />
              <Grid container spacing={1} style={{ padding: '10px' }}>
                <Grid item xs={6}>
                  <Button
                    color="primary"
                    size="small"
                    className={`${classes.actionButton} ${classes.secondaryActionBtn}`}
                    onClick={handleClearBtnClick}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    color="primary"
                    size="small"
                    className={`${classes.actionButton} ${classes.secondaryActionBtn}`}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Grid>
                {filterName === "date" && (
                  <Grid item xs={12}>
                    <Button
                      size="small"
                      className={`${classes.actionButton} ${classes.submitButton}`}
                      onClick={handleSubmitBtnClick}
                    >
                      Apply
                    </Button>
                    </Grid>
                )}
              </Grid>
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
