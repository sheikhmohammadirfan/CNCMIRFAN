import { Box, Button, Icon, IconButton, InputAdornment, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useState } from 'react'
import { TextControl } from '../../Utils/Control';
import FilterDropdown from '../../Utils/DataTable/FilterDropdown';
import colorShader from '../../Utils/ColorShader';
import FILTER_HANDLERS from './FilterHandlerMap';

// Generate Styles
const useStyle = makeStyles((theme) => ({
  searchInput: {
    width: 300,
    '@media (max-width: 960px)': {
      flexGrow: 1,
    },
    backgroundColor: 'white',
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
      height: 35
    },
    // overflow: "hidden"
  },

  addInRiskButton: {
    '&.Mui-disabled': {
      backgroundColor: `${colorShader(theme.palette.primary.main, 0.6)} !important`
    },
    '&.Mui-disabled img': {
      opacity: 0.4
    },
    maxHeight: 34,
    color: "#FFFFFF !important",
    paddingInline: 10,
    textTransform: 'none',
    transition: "color 0s"
  },


  actionButton: {
    maxHeight: 34,
    textTransform: 'none',
    color: theme.palette.primary.main,
    "&.text": {
      border: "none",
      paddingInline: 6
    }
  },
}))

const RiskLibraryHeader = ({
  selectedRows,
  tableFilters,
  filters: { filters, changeFilters, clearFilters, triggerFilters },
  openAddRiskForm,
  onSearch
}) => {

  const classes = useStyle();

  const [searchValue, setSearchValue] = useState(null);
  const updateSearch = (e) => {
    const searchedValue = e.target.value;
    setSearchValue(searchedValue);
  };

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      mt={2}
      display="flex"
      justifyContent="space-between"
      paddingY={1}
      paddingX={1}
      padding={1}
      border={1}
      sx={{
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#fff',
        borderBottom: 'none',
        '& .MuiButton-startIcon': {
          marginRight: !aboveMd && 0,
          marginLeft: !aboveMd && 0
        },
        '& .MuiButton-root': {
          padding: aboveMd && '6px 16px',
        },
        borderColor: '#d9d9d9'
      }}
    >
      {/* Filters */}
      <Box
        display="flex"
        gridColumnGap={8}>
        {Object.values(tableFilters)
          .sort((a, b) => (a.order - b.order))
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
        {Object
          .values(filters)
          .some(filter => filter.length > 0) &&
          <Button
            variant='text'
            disableElevation
            className={`${classes.actionButton} text`}
            onClick={() => {
              clearFilters();
              triggerFilters();
            }}
          >
            Clear Filters
          </Button>}
      </Box>

      <Box display="flex" gridColumnGap={8}>

        {/* Search field */}
        <TextControl
          variant="outlined"
          placeholder="Search here"
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
              <InputAdornment position="absolute" style={{ position: 'absolute', right: -6 }}>
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
          onKeyDown={e => {
            if (e.keyCode === 13) {
              onSearch(e.target.value);
            }
          }}
        />

        {/* Add in Risk form */}
        <Box display="flex" gridColumnGap={8}>
          <Button
            size='small'
            variant='contained'
            disableElevation
            color='primary'
            startIcon={<Icon>add</Icon>}
            className={classes.addInRiskButton}
            disabled={selectedRows.length !== 1}
            onClick={openAddRiskForm}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default RiskLibraryHeader