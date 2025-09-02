import React, { useState } from 'react'
import DialogBox from './DialogBox'
import { Box, Button, Typography } from '@mui/material'

const DeleteConfirmationDialog = ({
  open,
  closeHandler,
  deleteState,
  title = 'Are you sure ?',
  titleSX = {},
  bodyText = 'Are you sure you want to delete selected row ?',
  className = '',
  confirmBtnText = 'Delete',
  confirmHandler,
  btnVariant = 'error'
}) => {

  // Loading status for dialog
  const [isFormLoading, setisFormLoading] = useState(false);

  const handleConfirmClick = async () => {
    setisFormLoading(true);
    await confirmHandler(deleteState);
    setisFormLoading(false)
  }

  return (
    <DialogBox
      open={open}
      close={closeHandler}
      title={
        <Typography sx={{ ...titleSX }}>
          {title}
        </Typography>
      }
      className={className}
      loading={isFormLoading}
      content={
        <Box>
          <Typography>{bodyText}</Typography>
        </Box>
      }
      actions={[
        <Button
          variant="outlined"
          color={btnVariant}
          size="large"
          onClick={closeHandler}
          disabled={isFormLoading}
        >
          CANCEL
        </Button>,
        <Button
          variant="contained"
          color={btnVariant}
          size="large"
          form="role-form"
          type="submit"
          disabled={isFormLoading}
          onClick={handleConfirmClick}
        >
          {confirmBtnText}
        </Button>,
      ]}
    />
  )
}

export default DeleteConfirmationDialog