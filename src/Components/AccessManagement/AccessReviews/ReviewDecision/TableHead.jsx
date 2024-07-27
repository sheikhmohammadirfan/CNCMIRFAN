import { Box, Button, Icon, IconButton, InputAdornment, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react'
import FilterDropdown from '../../../Utils/DataTable/FilterDropdown';
import { TextControl } from '../../../Utils/Control';
import { useStyle } from './Utils';

const TableHead = ({
  tableFilters,
  filters: { filters, changeFilters = () => { }, clearFilters = () => { }, triggerFilters = () => { } }
}) => {
  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  const classes = useStyle();
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
              filterHandlerMap={{}}
            />
          ))}
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
                {false ? (
                  <IconButton
                    size="small"
                    color="#4477CE"
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
                {false && (
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
              // onSearch(e.target.value);
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default TableHead