import { Box } from '@mui/material'
import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Policies from '../Components/DocCompliance/Policies/Policies';
import { makeStyles } from '@material-ui/core';
import PolicyDetail from '../Components/DocCompliance/Policies/PolicyDetail';

const useStyle = makeStyles((theme) => ({
  accessManagementContainer: {
    padding: theme.spacing(2),
  },
}));

const DocCompliance = () => {

  const classes = useStyle();

  return (
    <Box className={classes.accessManagementContainer}>
      <Switch>
        <Route exact path="/doc-compliance/policies">
          <Policies />
        </Route>
        <Route exact path="/doc-compliance/policies/:id">
          <PolicyDetail />
        </Route>
      </Switch>
    </Box>
  )
}

export default DocCompliance