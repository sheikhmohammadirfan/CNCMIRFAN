import React, { useEffect, useState } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import RiskRegister from '../Components/RiskManagement/RiskRegister/RiskRegister'
import RiskManagementContext from '../Components/RiskManagement/RiskManagementContext'
import { getCategories, getImpactScores, getLikelihoodScores, getOwners } from '../Service/RiskManagement.service'

const useStyle = makeStyles((theme) => ({
  riskManagementContainer: {
    padding: theme.spacing(2),
  }
}))

const RiskManagement = () => {

  // Setting these 4 states as global states for all risk management tabs, as it is required by multiple tabs
  const [categories, setCategories] = useState([]);
  const [likelihoodScores, setLikelihoodScores] = useState([]);
  const [impactScores, setImpactScores] = useState([]);
  const [owners, setOwners] = useState([])

  // Fetching all 4 things
  useEffect(() => {
    (async () => {
      try {
        const categoriesRes = await getCategories()
        setCategories(categoriesRes.data);
        const likelihoodScoresRes = await getLikelihoodScores();
        setLikelihoodScores(likelihoodScoresRes.data);
        const impactScoresRes = await getImpactScores();
        setImpactScores(impactScoresRes.data)
        const ownersRes = await getOwners();
        setOwners(ownersRes.data)
      }
      catch (err) {
        console.log(err);
      }
    })()
  }, [])

  // Making a context object to pass, so below fields are available everywhere to use
  const contextValues = {
    categories: {
      categories,
      setCategories
    },
    owners: {
      owners,
      setOwners
    },
    scores: {
      likelihoodScores: likelihoodScores,
      setLikelihoodScores: setLikelihoodScores,
      impactScores: impactScores,
      setImpactScores: setImpactScores,
    }
  }

  const classes = useStyle();

  return (
    <Box
      className={classes.riskManagementContainer}
    >
      <RiskManagementContext.Provider value={contextValues}>
        <RiskRegister />
      </RiskManagementContext.Provider>
    </Box>
  )
}

export default RiskManagement