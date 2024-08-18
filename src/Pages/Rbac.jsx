import { Box } from '@mui/material'
import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min'
import Users from '../Components/Rbac/Users/Users'
import Roles from '../Components/Rbac/Roles/Roles'

const Rbac = () => {
  return (
    <Box p={2}>
      <Switch>
        <Route exact path="/rbac/users">
          <Users />
        </Route>
        <Route exact path="/rbac/roles">
          <Roles />
        </Route>
      </Switch>
    </Box>
  )
}

export default Rbac