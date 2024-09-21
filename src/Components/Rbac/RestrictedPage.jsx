import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import wrongWaySvg from '../../assets/img/wrong-way.svg'

const RestrictedPage = () => {

  const history = useHistory();

  return (
    <Stack spacing={3} justifyContent='center' alignItems='center' height='100%'>
      <img height={400} src={wrongWaySvg} alt="restricted page" />
      <Typography>This page isn't for you. Contact your administrator to get access</Typography>
      <Button
        disableElevation
        variant="contained"
        sx={{ textTransform: 'none' }}
        onClick={() => history.goBack()}
      >
        Head Back
      </Button>
    </Stack>
  )
}

export default RestrictedPage