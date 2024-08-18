import { Box, Button, Icon, IconButton, InputAdornment, Stack } from '@mui/material'
import React from 'react'
import { useStyle } from './utils'
import { TextControl } from '../../Utils/Control';

const Header = ({
  selectedRows,
  openAddForm,
  openEditForm
}) => {

  const classes = useStyle();

  return (
    <Box>
      <Box className={classes.headerContainer}>
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
              // onSearch(e.target.value);
            }
          }}
        />

        <Stack direction='row' alignItems='center' spacing={1}>
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
            Add Role
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default Header