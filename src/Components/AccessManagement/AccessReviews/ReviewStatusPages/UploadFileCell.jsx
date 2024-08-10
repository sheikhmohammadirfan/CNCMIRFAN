import { Icon, styled } from '@material-ui/core'
import { Box, Button, Typography } from '@mui/material'
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

const UploadFileCell = ({ uploaded, row, handleFileInputChange }) => {
  return (
    <Box display='flex' alignItems='center' columnGap={1}>

      <Typography variant='body2'>
        {uploaded ? "Uploaded" : "Not Uploaded"}
      </Typography>
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
      >
        Upload File
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => handleFileInputChange(e, row)}
          onClick={e => (e.target.value = null)}
        />
      </Button>

    </Box>
  )
}

export default UploadFileCell