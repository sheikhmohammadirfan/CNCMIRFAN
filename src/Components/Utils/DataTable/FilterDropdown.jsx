import { Box, Button, Checkbox, ClickAwayListener, Divider, FormControlLabel, Icon, List, ListItem, Tooltip, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import colorShader from '../ColorShader';

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
    padding: "0 0 0 8px"
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
  clearButton: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    textTransform: "none",
    height: 25,
    width: "100%",
    "&:hover": {
      backgroundColor: colorShader(theme.palette.primary.main, 0.85)
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
  trigger = () => {}
}) => {

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    trigger();
  }

  // Handling checkbox clicks and changing filters
  const handleCheckboxClick = (filterItem_id) => {
    changeFilters(filterName, filterItem_id)
  }

  // Checking if filters are active, if yes then how many?
  let isFiltersActive = activeFilters.length !== 0;
  let activeFiltersCount = activeFilters.length

  return (
    <Tooltip
      interactive
      placement='bottom-start'
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
                            checked={activeFilters.includes(filterItem.id)}
                            onChange={() => handleCheckboxClick(filterItem.id)}
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
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px"
                }}
              >
                <Button
                  size='small'
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
        size='small'
        endIcon={<Icon className={classes.filterButtonIcon}>arrow_forward_ios</Icon>}
        className={classes.filterButton}
        onClick={() => setOpen(true)}
        data-active={isFiltersActive ? "true" : "false"}
      >
        {buttonText}
        {isFiltersActive ? ` (${activeFiltersCount})` : ""}
      </Button>
    </Tooltip>
  )
}

export default FilterDropdown