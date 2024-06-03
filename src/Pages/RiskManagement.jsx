import React from 'react'
import RiskManagementHeader from '../Components/RiskManagement/RiskRegister/RiskRegisterHeader'
import { Box, makeStyles } from '@material-ui/core'
import RiskRegister from '../Components/RiskManagement/RiskRegister/RiskRegister'

const useStyle = makeStyles((theme) => ({
  riskManagementContainer: {
    padding: theme.spacing(2),
  }
}))

const RiskManagement = () => {

  const classes = useStyle();

  return (
    <Box
      className={classes.riskManagementContainer}
    >
      <RiskRegister />
    </Box>
  )
}

export default RiskManagement