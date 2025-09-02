import { Icon, styled } from '@material-ui/core'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import React from 'react'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadFileCell = ({ uploaded, row, handleFileInputChange, disabled = false }) => {
  return (
    <Box display='flex' alignItems='center' columnGap={1}>

      <Typography variant='body2'>
        {uploaded ? "Uploaded" : "Not Uploaded"}
      </Typography>
      <Tooltip placement="bottom-start" title={disabled && "You don't have edit access"}>
        <span>
          <Button
            startIcon={<Icon>upload</Icon>}
            sx={{ textTransform: 'none' }}
            variant='outlined'
            disableElevation
            size='small'
            onClick={(e) => e.stopPropagation()}
            role={undefined}
            tabIndex={-1}
            component='label'
            disabled={disabled}
          >
            Upload File
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => handleFileInputChange(e, row)}
              onClick={e => (e.target.value = null)}
              disabled={disabled}
            />
          </Button>
        </span>
      </Tooltip>

    </Box>
  )
}

export default UploadFileCell