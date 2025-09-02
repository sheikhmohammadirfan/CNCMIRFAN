import { Box, Button, Icon, IconButton, InputAdornment, Stack } from '@mui/material'
import React from 'react'
import { useStyle } from './utils'
import { TextControl } from '../../Utils/Control';
import FilterDropdown from '../../Utils/DataTable/FilterDropdown';
import FILTER_HANDLERS from './FilterHandler';

const Header = ({
  openAddForm,
  openEditForm,
  openUpload,
  openInvite,
  handleSearch,
  tableFilters,
  activeFilters,
  changeFilters,
  clearFilters,
  selectedRows,
}) => {

  const classes = useStyle();

  return (
    <Box>
      <Box mb={2} className={classes.actionsContainer}>

        <Stack direction='row' alignItems='center' spacing={1}>
          <Button
            className={classes.headerBtn}
            variant='contained'
            size='medium'
            disableElevation
            onClick={openAddForm}
            startIcon={
              <Icon>add</Icon>
            }
          >
            Add User
          </Button>
          <Button
            className={`${classes.headerBtn} ${classes.whiteBtn}`}
            variant='contained'
            size='medium'
            disableElevation
            disabled={selectedRows.length !== 1}
            onClick={openEditForm}
            startIcon={
              <Icon>edit</Icon>
            }
          >
            Edit User
          </Button>
        </Stack>

        <Stack direction='row' alignItems='center' spacing={1}>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            className={`${classes.headerBtn} ${classes.whiteBtn}`}
            startIcon={
              <Icon>email</Icon>
            }
            disableElevation
            disabled={selectedRows.length < 1}
            onClick={openInvite}
          >
            Invite User
          </Button>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            className={`${classes.headerBtn} ${classes.whiteBtn}`}
            startIcon={
              <Icon>upload</Icon>
            }
            disableElevation
            onClick={openUpload}
          >
            Upload Users
          </Button>
        </Stack>

      </Box>
      {/* <Box className={classes.tableFilterContainer}>

        <Box className={classes.filterDropdownsContainer}>
          {Object.values(tableFilters)
            .sort((a, b) => (a.order - b.order))
            .map((filter, index) => (
              <FilterDropdown
                key={index}
                filterName={filter.name}
                buttonText={filter.text}
                filterOptions={filter.options}
                activeFilters={activeFilters[filter.name]}
                changeFilters={changeFilters}
                clearFilters={clearFilters}
                // contextLoading={contextLoading}
                filterHandlerMap={FILTER_HANDLERS}
              // filterMetadata={filterMetadata}
              />
            ))}
        </Box>
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
                    onClick={() => {
                      // updateSearch({ target: { value: "" } });
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
              handleSearch(e.target.value);
            }
          }}
        />

      </Box> */}
    </Box>
  )
}

export default Header