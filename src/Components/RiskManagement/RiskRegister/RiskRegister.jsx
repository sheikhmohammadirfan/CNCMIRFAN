import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import RiskRegisterHeader from './RiskRegisterHeader'

const RiskRegister = () => {

  const [filters, setFilters] = useState({
    categories: [0, 1, 3],
  })


  // Click handlers for more options
  const viewArchived = () => {
    console.log("View Archived");
  }

  const hideGuide = () => {
    console.log("Hide Guide");
  }

  const exportAllScenarios = () => {
    console.log("Export All");
  }

  // Click handlers for share options
  const createSnapshot = () => {
    console.log("create Snapshot");
  }

  const generateAssessmentReport = () => {
    console.log("Generate Assessment Report");
  }

  const configAuditorView = () => {
    console.log("configure auditor view");
  }

  // Click handlers for add scenario options
  const addManualScenario = () => {
    console.log("Add Manual Scenario");
  }

  const addScenarioViaLibrary = () => {
    console.log("add scenario via library");
  }

  const addScenarioViaImport = () => {
    console.log("Add scenario via import");
  }

  return (
    <Box>
      <RiskRegisterHeader
        moreOptionsHandlers={{ viewArchived, hideGuide, exportAllScenarios }}
        shareOptionsHandlers={{ createSnapshot, generateAssessmentReport, configAuditorView }}
        addScenarioOptionsHandlers={{ addManualScenario, addScenarioViaLibrary, addScenarioViaImport }}
      />
    </Box>
  )
}

export default RiskRegister