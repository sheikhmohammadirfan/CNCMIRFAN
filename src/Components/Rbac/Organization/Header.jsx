import { Box, Button, Icon, IconButton, InputAdornment, Stack } from '@mui/material';
import React from 'react'
import { useStyle } from './utils';
import { TextControl } from '../../Utils/Control';
import FilterDropdown from '../../Utils/DataTable/FilterDropdown';

const Header = ({
  tableFilters,
  activeFilters,
  changeFilters,
  clearFilters,
  selectedRows,
  openAddForm,
  openEditForm,
  openInviteForm,
  handleSearch
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
            startIcon={
              <Icon>add</Icon>
            }
            onClick={openAddForm}
          >
            Add Organization
          </Button>
          <Button
            className={`${classes.headerBtn} ${classes.whiteBtn}`}
            variant='contained'
            size='medium'
            disableElevation
            disabled={selectedRows.length !== 1}
            // onClick={openEditForm}
            startIcon={
              <Icon>edit</Icon>
            }
            onClick={openEditForm}
          >
            Edit Organization
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
            onClick={openInviteForm}
          >
            Invite Client Admin
          </Button>
        </Stack>

      </Box>
      <Box className={classes.tableFilterContainer}>

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
              // filterHandlerMap={FILTER_HANDLERS}
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

      </Box>
    </Box>
  )
}

export default Header