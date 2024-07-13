import React from "react";
import AccessAccounts from "../Components/AccessManagement/Accounts/AccessAccounts";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import AccessReviews from "../Components/AccessManagement/AccessReviews/AccessReviews";
import UserDetails from "../Components/AccessManagement/AccessReviews/UserDetails";
import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  accessManagementContainer: {
    padding: theme.spacing(2),
  },
}));

function AccessManagement() {
  const classes = useStyle();

  return (
    <>
      <Box className={classes.accessManagementContainer}>
        <Switch>
          <Route exact path="/access_management/accounts">
            <AccessAccounts />
          </Route>
          <Route exact path="/access_management/reviews">
            <AccessReviews />
          </Route>
          <Route path="/access_management/reviews/user-details/:id" component={UserDetails} />
        </Switch>
      </Box>
    </>
  );
}

export default AccessManagement;
