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
import ReviewDecisions from "../Components/AccessManagement/AccessReviews/ReviewDecision/ReviewDecisions";

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
          <Route exact path="/access-management/accounts">
            <AccessAccounts />
          </Route>
          <Route exact path="/access-management/reviews">
            <AccessReviews />
          </Route>
          <Route exact path="/access-management/reviews/draft/:id" component={UserDetails} />
          <Route exact path="/access-management/reviews/in-review/:id" component={UserDetails} />
          <Route exact path="/access-management/reviews/completed/:id" component={UserDetails} />
          
          <Route exact path="/access-management/reviews/draft/review-decisions/:id">
            <ReviewDecisions />
          </Route>
          <Route exact path="/access-management/reviews/in-review/review-decisions/:id">
            <ReviewDecisions />
          </Route>
          <Route exact path="/access-management/reviews/completed/review-decisions/:id">
            <ReviewDecisions />
          </Route>

        </Switch>
      </Box>
    </>
  );
}

export default AccessManagement;
