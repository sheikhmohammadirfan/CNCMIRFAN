import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import RiskRegisterHeader from './RiskRegisterHeader'
import DataTable from '../../Utils/DataTable/DataTable'
import { HeaderCell, RowCell, generateRows, mapDataToHeader, useStyle } from './RiskRegisterUtils'
import { risk_register_columns, risk_register_columns_width } from '../../../assets/data/RiskManagement/RiskRegisterColumns'
import { getRegister, getInherentRisks, getOwners, getResidualRisks } from '../../../Service/RiskRegister.service'
import useLoading from '../../Utils/Hooks/useLoading'
import SkeletonBox from '../../Utils/SkeletonBox'
import RiskManagementContext from '../RiskManagementContext'
import RiskRegisterFilters, { cia_categories, treatmentTypes } from '../../../assets/data/RiskManagement/RiskRegisterFilters'
import RegisterDialog from './RegisterDialog'
import { dummy_row } from '../../../assets/data/RiskManagement/RiskRegisterMockData'

const RiskRegister = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(RiskRegisterFilters)
  // Fetching all the filters before rendering the UI
  useLayoutEffect(() => {
    (async () => {
      try {

        const inherent_risk = await getInherentRisks();
        const residual_risk = await getResidualRisks();

        setFilterDropdowns(prev => ({
          ...prev,
          inherentRisk: { ...prev.inherentRisk, options: inherent_risk.data },
          residualRisk: { ...prev.residualRisk, options: residual_risk.data },
        }))
      }
      catch (err) {
        console.log(err);
      }
    })()
  }, [])

  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const { categories: { categories, setCategories }, owners: { owners, getOwners }, scores } = useContext(RiskManagementContext);

  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      owners: { ...prev.owners, options: owners },
      categories: { ...prev.categories, options: categories }
    }))
  }, [categories, owners])

  // REGISTER TABLE: State to store the register table data
  const [register, setRegister] = useState({})

  // Function to fetch register data, and set the state
  const fetchandSetRegister = useCallback(async (owners, scores) => {
    startLoading();
    if (scores.likelihoodScores.length === 0 || scores.impactScores.length === 0 || owners.length === 0) return;
    const { data } = await getRegister(owners, scores.likelihoodScores, scores.impactScores);
    setRegister(data);
    stopLoading();
  }, [])

  useEffect(() => {
    fetchandSetRegister(owners, scores);
  }, [owners, scores])

  // State to track which rows are selected
  const [selectedRow, setSelectedRow] = useState([]);

  const getCurrentIndex = () => {
    if (selectedRow.length === 0) return -1;
    return selectedRow[0];
  }

  // State for matched cell
  const [matchedCell, setMatchedCell] = useState([]);

  // If this state has some key missing from RiskRegisterFilters.jsx in data folder, it will result in error.
  // That is why, all the keys in this state are predefined.
  const [filters, setFilters] = useState({
    owners: [],
    categories: [],
    treatment: [],
    inherent: [],
    residual: [],
    ciaCategories: [],
    source: [],
    status: [],
    identified: [],
    vendor: []
  })
  const changeFilters = (filterName, itemId) => {
    setFilters(prev => {
      // Getting prev filters array of the filter
      let currentFilters = prev[filterName];
      // If id is already in filter, remove it, else add the id
      let updatedFilterIds = currentFilters.includes(itemId)
        ? currentFilters.filter((id) => id !== itemId)
        : [...currentFilters, itemId]
      return ({
        ...prev,
        [filterName]: updatedFilterIds
      })
    })
  }
  const clearFilters = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: []
    }))
  }

  // State to toggle dialog, for adding scenario manually, and editing it
  const [scenarioDialog, setScenarioDialog] = useState(false);
  const closeScenarioDialog = () => setScenarioDialog(false);

  // CLICK handlers for add scenario options
  const addManualScenario = () => resetPageState() & setScenarioDialog(true);
  // reset page before trying to add new scenario
  const resetPageState = () => {
    setSelectedRow([]);
  }
  const openEditForm = () => setScenarioDialog(true)

  const addScenarioViaLibrary = () => {
    console.log("add scenario via library");
  }

  const addScenarioViaImport = () => {
    console.log("Add scenario via import");
  }

  // CLICK handlers for more options
  const viewArchived = () => {
    console.log("View Archived");
  }

  const hideGuide = () => {
    console.log("Hide Guide");
  }

  const exportAllScenarios = () => {
    console.log("Export All");
  }

  // CLICK handlers for share options
  const createSnapshot = () => {
    console.log("create Snapshot");
  }

  const generateAssessmentReport = () => {
    console.log("Generate Assessment Report");
  }

  const configAuditorView = () => {
    console.log("configure auditor view");
  }

  // All column names into a state
  const [allColumns, setAllColumns] = useState(risk_register_columns);
  const [visibleColumns, setVisibleColumns] = useState(risk_register_columns);

  // Functions for hide and show columns
  const hideColumn = (col) => {
    setVisibleColumns(prev => {
      return prev.filter(colName => colName !== col)
    })
  }
  const showColumn = (col) => {
    // Filtering using allColumns state (bcs it is sorted). and removing cols which are not in visibleCols
    // add one more condition to accept new col
    let visibleCols = allColumns.filter(
      colName => (visibleColumns.includes(colName) || colName === col))
    setVisibleColumns(visibleCols)
  }

  // Get score from a value between 0-100
  const getRiskScore = (val, isLikelihoodScore) => {
    let min = 0;
    let max = 100;
    let newMin = 1;
    let newMax = isLikelihoodScore ? scores.likelihoodScores.length : scores.impactScores.length;
    // Applying linear interpolation formula, to convert a value from 0-100 to an actual risk score
    let scaledValue = ((val - min) / (max - min)) * (newMax - newMin) + newMin;
    return scaledValue;
  }

  const onRegisterFormSubmit = async (val) => {
    // is new row
    if (getCurrentIndex() === -1) {
      const payload = {
        scenario: val.scenario,
        categories_id: val.categories.map(category => category.id),
        likelihood_id: scores.likelihoodScores.find(score => score.score === getRiskScore(val.inherent_likelihood, true)).id,
        impact_id: scores.impactScores.find(score => score.score === getRiskScore(val.inherent_impact, false)).id,
        notes: val.notes,
        cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
      }

      const newRow = {
        ...dummy_row,
        id: register.length + 1,
        scenario: JSON.stringify({
          id: 0,
          description: val.scenario,
          categories_id: val.categories.map(category => category.id),
          source_type: "CUSTOM"
        }),
        cia: cia_categories.filter(category => Boolean(val[category.name])).map(category => category.text),
        custom_id: val.customId,
        inherent_risk_likelihood_id: scores.likelihoodScores.find(score => score.score === getRiskScore(val.inherent_likelihood)).id,
        inherent_risk_impact_id: scores.impactScores.find(score => score.score === getRiskScore(val.inherent_impact)).id,
        notes: val.notes,
      }

      const localRegister = JSON.parse(localStorage.getItem("risk-register"))
      localRegister.push(newRow);
      localStorage.setItem("risk-register", JSON.stringify(localRegister));
      closeScenarioDialog();
      return fetchandSetRegister(owners, scores);
    }
    else {
      // is edit row
      const payload = {
        scenario: {
          id: 0,
          description: val.scenario,
          categories_id: val.categories.map(category => category.id),
          source_type: val.source || "SYSTEM" || "CUSTOM"
        },
        owner: val.owner || "",
        identified_date: val.identified_date,
        modified_date: val.modified_date,
        cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
        custom_id: val.customId,
        inherent_risk_likelihood_id: scores.likelihoodScores.find(score => score.score === getRiskScore(val.inherent_likelihood)).id,
        inherent_risk_impact_id: scores.impactScores.find(score => score.score === getRiskScore(val.inherent_impact)).id,
        residual_risk_likelihood_id: val.residual_likelihood ? scores.likelihoodScores.find(score => score.score === getRiskScore(val.residual_likelihood)).id : null,
        residual_risk_impact_id: val.residual_impact ? scores.likelihoodScores.find(score => score.score === getRiskScore(val.residual_impact)).id : null,
        notes: val.notes,
        treatment_type: treatmentTypes.find(type => type.text === val.treatment_plan).id,
        treatment_controls: [],
        is_approved: false,
        is_archived: false,
      }
      console.log(payload);
    }
  }

  // Get a value between 0-100 from a small number
  const getSliderValue = (num, isLikelihoodScore) => {
    let min = 1;
    let max = isLikelihoodScore ? scores.likelihoodScores.length : scores.impactScores.length;
    let newMin = 0;
    let newMax = 100;
    // Applying linear interpolation formula, to convert a small value from 0-5/10 to a value between 0-100
    let sliderValue = ((num - min) / (max - min)) * (newMax - newMin) + newMin;
    return sliderValue;
  }

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(visibleColumns);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      register,
      visibleColumns,
      selectedRow,
      matchedCell,
      categories,
      owners,
      scores,
      // sortingMap
    );

  // Get classes from useStyle, which is in RiskRegisterUtils
  const classes = useStyle();

  return (
    <Box>

      <Box
        className={classes.registerContainer}
      >
        <RiskRegisterHeader
          // Dropdown options click handlers
          addScenarioOptionsHandlers={{ addManualScenario, addScenarioViaLibrary, addScenarioViaImport }}
          moreOptionsHandlers={{ viewArchived, hideGuide, exportAllScenarios }}
          shareOptionsHandlers={{ createSnapshot, generateAssessmentReport, configAuditorView }}
          // Dropdown data for filters
          tableFilters={filterDropdowns}
          // activeFilters to set checked, and setFilters to handle changes
          activeFilters={filters}
          changeFilters={changeFilters}
          clearFilters={clearFilters}
          // Selected rows
          selectedRows={selectedRow}
          // Edit button click handler
          editHandler={openEditForm}
          cols={{ allColumns, visibleColumns, hideColumn, showColumn }}
        />

        {isLoading()
          ?
          <SkeletonBox text="Loading.." height="60vh" width="100%" />
          :
          <Grid
            container
            spacing={1}
            className={classes.gridContainer}
          >
            <Grid
              item
              xs={12}
            >
              <DataTable
                className={classes.tableStyle}
                verticalBorder={true}
                header={mapTableHeader()}
                rowList={mapTableBody()}
                checkbox={true}
                minCheckboxWidth={50}
                serialNo={false}
                resizeTable={true}
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                headerWrapper={(text) => <HeaderCell text={text} />}
                // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
                style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                minCellWidth={visibleColumns.map(
                  (name) => risk_register_columns_width[allColumns.indexOf(name)]
                )}
              />
            </Grid>

            {/* <SecondaryTable
          data={getPoam()}
          currentRow={getRowIndex(getPoam(), secondaryOpen, sortingMap)}
          columnsList={secondaryColumns.filter(
            (name) => !hiddenColumns.includes(name)
          )}
          closeTable={() => setSecondaryOpen(-1)}
        /> */}
          </Grid>
        }
      </Box>

      <RegisterDialog
        open={scenarioDialog}
        closeHandler={closeScenarioDialog}
        rowIndex={getCurrentIndex()}
        row={register[getCurrentIndex()]}
        autocompleteOptions={{ categories, owners: filterDropdowns.owners.options }}
        getSliderValue={getSliderValue}
        scores={scores}
        onFormSubmit={onRegisterFormSubmit}
      />
    </Box>
  )
}

export default RiskRegister