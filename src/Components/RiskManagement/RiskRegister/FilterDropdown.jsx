import { Box, Button, Checkbox, ClickAwayListener, Divider, FormControlLabel, Icon, List, ListItem, Tooltip, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  customTooltip: {
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    marginTop: "6px",
    padding: "4px 0 0",
    "& .MuiListItem-root": {
      padding: 0
    },
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
  checkboxLabel: {
    width: "100%",
    color: "rgba(0, 0, 0, 0.87)",
    "&>.MuiFormControlLabel-label": {
      fontSize: "0.8rem",
    },
    "& input": {
      // Tried to style checkbox. didn't work :\
    }
  },
  clearButton: {
    backgroundColor: "#4477CE",
    color: "white",
    textTransform: "none",
    height: 25,
    width: "100%",
    "&:hover": {
      backgroundColor: "rgba(68, 119, 206, 0.85)"
    }
  }
}))

const FilterDropdown = ({ filterName, buttonText, filterOptions, activeFilters, changeFilters, clearFilters }) => {

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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
                  .sort((a, b) => (a.order - b.order))
                  .map((filterItem, index) => (
                    <ListItem key={index} style={{ padding: "0 0 0 8px" }}>
                      <FormControlLabel
                        className={classes.checkboxLabel}
                        control={
                          <Checkbox
                            size='small'
                            checked={activeFilters.includes(filterItem.id)}
                            onChange={() => handleCheckboxClick(filterItem.id)}
                            style={{
                              color: "#4477CE"
                            }}
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
        endIcon={<Icon style={{ rotate: '90deg', fontSize: '0.8rem' }}>arrow_forward_ios</Icon>}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          textTransform: "none",
          paddingInline: 10,
          color: isFiltersActive ? '#4477CE' : "rgba(0, 0, 0, 0.75)"
        }}
        onClick={() => setOpen(true)}
      >
        {buttonText}
        {isFiltersActive ? ` (${activeFiltersCount})` : ""}
      </Button>
    </Tooltip>
  )
}

export default FilterDropdown