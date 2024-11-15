import { Box, Button, Icon, IconButton, InputAdornment, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useState } from 'react'
import FilterDropdown from '../../Utils/DataTable/FilterDropdown';
import { TextControl } from '../../Utils/Control';
import colorShader from '../../Utils/ColorShader';
import { FILTER_HANDLERS } from './utils';

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

  outlineButton: {
    '&.Mui-disabled': {
      color: `${colorShader('#4477CE', 0.5)} !important`
    },
    '&.Mui-disabled img': {
      opacity: 0.4
    },
    maxHeight: 34,
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: '1px solid rgba(0, 0, 0, 0.2)',
    paddingInline: 10,
    textTransform: 'none',
  },

  addActionButton: {
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
    fontSize: "0.8rem",
    backgroundColor: colorShader(theme.palette.primary.main, 0.05),
    "&:hover": {
      backgroundColor: colorShader(theme.palette.primary.main, 0.1),
    },
    borderRadius: 5,
    color: theme.palette.primary.main,
    textTransform: 'none',
    '&.MuiButton-root': {
      '@media (max-width: 960px)': {
        minWidth: '50px',
      }
    },
    '& .MuiButton-endIcon': {
      '@media (max-width: 960px)': {
        marginLeft: 0,
        marginRight: 0,
      }
    }
  }
}))

const Header = ({
  hasAccess,
  tableFilters,
  filters: { filters, changeFilters, clearFilters },
  triggerFilters,
  selectedRows,
  openForm,
  onSearch,
}) => {

  // State to control search value
  const [searchValue, setSearchValue] = useState(null);
  const updateSearch = (e) => {
    const searchedValue = e.target.value;
    setSearchValue(searchedValue);
  };

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

  const classes = useStyle();

  return (

    <Box>
      <Box
        mt={2}
        display={'flex'}
        justifyContent={'space-between'}
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
          display={"flex"}
          gridColumnGap={8}
        >
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
        </Box>

        <Box
          display="flex"
          gridColumnGap={8}
        >
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
            // value={}
            // onChange={}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                onSearch(e.target.value);
              }
            }}
          />
          <Button
            size='small'
            variant='contained'
            disableElevation
            color='primary'
            startIcon={<Icon>add</Icon>}
            className={classes.addActionButton}
            onClick={openForm}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Header