import { Box } from '@mui/material'
import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Policies from '../Components/DocCompliance/Policies/Policies';
import { makeStyles } from '@material-ui/core';
import PolicyDetail from '../Components/DocCompliance/Policies/PolicyDetail';
import PolicyEditor from '../Components/DocCompliance/Policies/PolicyEditor';

const useStyle = makeStyles((theme) => ({
  docComplianceContainer: {
    padding: theme.spacing(2),
    height: '100%',
  },
}));

const DocCompliance = () => {

  const classes = useStyle();

  return (
    <Box className={classes.docComplianceContainer}>
      <Switch>
        <Route exact path="/doc-compliance/policies">
          <Policies />
        </Route>
        <Route exact path="/doc-compliance/policies/:id">
          <PolicyDetail />
        </Route>
        <Route exact path="/doc-compliance/policies/:id/editor">
          <PolicyEditor />
        </Route>
      </Switch>
    </Box>
  )
}

export default DocCompliance