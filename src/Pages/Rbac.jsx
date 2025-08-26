import { Box } from '@mui/material'
import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min'
import Users from '../Components/Rbac/Users/Users'
import Roles from '../Components/Rbac/Roles/Roles'
import CompanyAdminRoutes from '../Components/Utils/Routers/CompanyAdminRoutes'
import Organization from '../Components/Rbac/Organization/Organization'
import FalconAdminRoute from '../Components/Utils/Routers/FalconAdminRoute'

const Rbac = () => {
  return (
    <Box p={2}>
      <Switch>
        <Route exact path="/rbac/users">
          <CompanyAdminRoutes>
            <Users />
          </CompanyAdminRoutes>
        </Route>
        <Route exact path="/rbac/roles">
          <CompanyAdminRoutes>
            <Roles />
          </CompanyAdminRoutes>
        </Route>
        {/* <Route exact path="/rbac/organization">
          <FalconAdminRoute>
            <Organization />
          </FalconAdminRoute>
        </Route> */}
      </Switch>
    </Box>
  )
}

export default Rbac