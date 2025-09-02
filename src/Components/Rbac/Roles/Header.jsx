import { Box, Button, Icon, IconButton, InputAdornment, Stack } from '@mui/material'
import React from 'react'
import { useStyle } from './utils'
import { TextControl } from '../../Utils/Control';

const Header = ({
  selectedRows,
  openAddForm,
  openEditForm,
  openDeleteForm,
}) => {

  const classes = useStyle();

  return (
    <Box>
      <Box className={classes.headerContainer}>

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

        <Stack direction='row' alignItems='center' spacing={1}>
          <Button
            className={`${classes.headerBtn} ${classes.whiteBtn}`}
            variant='contained'
            size='medium'
            disableElevation
            disabled={selectedRows.length !== 1}
            onClick={openDeleteForm}
            startIcon={
              <Icon>delete</Icon>
            }
          >
            Delete Role
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
            Edit Role
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default Header