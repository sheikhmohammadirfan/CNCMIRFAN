import { Icon } from '@material-ui/core'
import { Box, Button, Tooltip } from '@mui/material'
import React from 'react'

const FlagCell = ({ id, flagged, clickHandler }) => {
  return (
    <Box>
      <Tooltip
        placement='right'
        title={
          <Button
            size='small'
            variant='contained'
            sx={{ textTransform: 'none' }}
            color='primary'
            disableElevation
            onClick={() => clickHandler(id, flagged)}
          >
            {flagged ? "Unset Flag" : "Flag Account"}
          </Button>
        }
        componentsProps={{
          tooltip: {
            sx: {
              p: 0,
            }
          }
        }}
      >
        <Icon style={{ color: '#999' }}>{flagged ? 'flag_2' : 'remove'}</Icon>
      </Tooltip>
    </Box>
  )
}

export default FlagCell