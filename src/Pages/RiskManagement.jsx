import React, { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import RiskRegister from "../Components/RiskManagement/RiskRegister/RiskRegister";
import RiskLibrary from "../Components/RiskManagement/RiskLibrary/RiskLibrary";
import RiskManagementContext from "../Components/RiskManagement/RiskManagementContext";
import {
  getCategories,
  getImpactScores,
  getLikelihoodScores,
  getOwners,
} from "../Service/RiskManagement/RiskManagement.service";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import ActionTracker from "../Components/RiskManagement/ActionTracker/ActionTracker";
import Settings from "../Components/RiskManagement/Settings/Settings";
import { getRiskScoreGroups } from "../Service/RiskManagement/RiskRegister.service";
import Agent from "../Components/RiskManagement/Agent/Agent";

const useStyle = makeStyles((theme) => ({
  riskManagementContainer: {
    padding: theme.spacing(2),
  },
}));

const RiskManagement = () => {
  // Setting these 4 states as global states for all risk management tabs, as it is required by multiple tabs
  const [categories, setCategories] = useState([]);
  const [likelihoodScores, setLikelihoodScores] = useState([]);
  const [impactScores, setImpactScores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [riskScoreGroups, setRiskScoreGroups] = useState([]);

  // Fetching all 4 things
  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      if (data) {
        setCategories(data);
      }
    })();
    (async () => {
      const { data } = await getLikelihoodScores();
      if (data) {
        setLikelihoodScores(data);
      }
    })();
    (async () => {
      const { data } = await getImpactScores();
      if (data) {
        setImpactScores(data);
      }
    })();
    (async () => {
      const { data } = await getOwners();
      setOwners(data);
    })();
    (async () => {
      const riskGroups = await getRiskScoreGroups();
      setRiskScoreGroups(riskGroups.data);
    })();
  }, []);

  // Making a context object to pass, so below fields are available everywhere to use
  const contextValues = {
    categories: {
      categories,
      setCategories,
    },
    owners: {
      owners,
      setOwners,
    },
    scores: {
      likelihoodScores,
      setLikelihoodScores,
      impactScores,
      setImpactScores,
      riskScoreGroups,
    },
    scoreGroups: {
      riskScoreGroups,
    },
  };

  const classes = useStyle();

  return (
    <Box className={classes.riskManagementContainer}>
      <RiskManagementContext.Provider value={contextValues}>
        <Switch>
          <Route exact path="/risk-management/risk-library">
            <RiskLibrary />
          </Route>
          <Route exact path="/risk-management/risk-register">
            <RiskRegister />
          </Route>
          <Route exact path="/risk-management/action-tracker">
            <ActionTracker />
          </Route>
          <Route exact path="/risk-management/agent">
            <Agent />
          </Route>
          <Route exact path="/risk-management/settings">
            <Settings />
          </Route>
        </Switch>
      </RiskManagementContext.Provider>
    </Box>
  );
};

export default RiskManagement;
