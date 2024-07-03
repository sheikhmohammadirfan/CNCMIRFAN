import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import RiskRegisterHeader from './RiskRegisterHeader'
import DataTable from '../../Utils/DataTable/DataTable'
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from './RiskRegisterUtils'
import { risk_register_columns, risk_register_columns_width } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterColumns'
import { getRegister, getOwners,  createRisk, getRiskScoreGroups, updateRegister } from '../../../Service/RiskManagement/RiskRegister.service'
import useLoading from '../../Utils/Hooks/useLoading'
import SkeletonBox from '../../Utils/SkeletonBox'
import RiskManagementContext from '../RiskManagementContext'
import RiskRegisterFilters, { cia_categories, treatmentTypes } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters'
import RiskFormDialog from '../RiskFormDialog'
import { dummy_row } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterMockData'

const RiskRegister = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const { categories: { categories, setCategories }, owners: { owners, getOwners }, scores } = useContext(RiskManagementContext);

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(RiskRegisterFilters);
  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      owners: { ...prev.owners, options: owners.map(o => ({ id: o.id, text: `${o.first_name} ${o.last_name}` })) },
      category: { ...prev.category, options: categories.map(c => ({ id:c.id, text:c.category_name })) },
      inherentRisk: { ...prev.inherentRisk, options: scores.riskScoreGroups?.map(c => ({ id:c.id, text:c.name })) || [] },
      residualRisk: { ...prev.residualRisk, options: scores.riskScoreGroups?.map(c => ({ id:c.id, text:c.name })) || [] },
    }))
  }, [categories, owners, scores]);
  
  const prevPayload = useRef("");
  const searchedValue = useRef("");
  // If this state has some key missing from RiskRegisterFilters.jsx in data folder, it will result in error.
  // That is why, all the keys in this state are predefined.
  const [filters, setFilters] = useState({
    owners: [],
    category: [],
    treatment: [],
    inherent: [],
    residual: [],
    ciaCategories: [],
    source: [],
    status: [],
    identified: [],
    vendor: []
  })

  // REGISTER TABLE: State to store the register table data
  const [{risks: register}, setRegister] = useState({risks: []})

  // Function to fetch register data, and set the state
  const fetchandSetRegister = async (reload) => {
    const payload = { filters: {}, search: searchedValue.current };
    if (filters.owners.length > 0) {
      payload.filters["owner"] = filters.owners;
    }
    if (filters.category.length > 0) {
      payload.filters["category"] = filters.category;
    }
    if (filters.treatment.length > 0) {
      payload.filters["treatment"] = filters.treatment;
    }
    if (filters.inherent.length > 0) {
      payload.filters["inherent"] = filters.inherent;
    }
    if (filters.residual.length > 0) {
      payload.filters["residual"] = filters.residual;
    }
    if (filters.ciaCategories.length > 0) {
      payload.filters["cia"] = filters.ciaCategories;
    }
    if (filters.source.length > 0) {
      payload.filters["source"] = filters.source;
    }
    if (filters.status.length > 0) {
      payload.filters["is_approved"] = filters.status;
    }
    if (filters.identified.length > 0) {
      let dateRange =
              filters.identified === 0
              ? [new Date(), (() => {const d = new Date(); d.setMonth(d.getMonth() - 3); return d})()]
              : filters.identified === 1
              ? [new Date(), (() => {const d = new Date(); d.setMonth(d.getMonth() - 6); return d})()]
              : filters.identified === 2
              ? [new Date(), (() => {const d = new Date(); d.setMonth(d.getMonth() - 12); return d})()]
              : [new Date(), new Date()];
      payload.filters["identified_date"] = [dateRange[0].toISOString(), dateRange[1].toISOString()];
    }
    const currPayload = JSON.stringify(payload);
    if (currPayload === prevPayload.current && !reload) {
      return;
    }
    prevPayload.current = currPayload;

    startLoading();
    const { data } = await getRegister(payload);
    if (data) {
      data.risks = data.risks.map(r => ({
        ID: r.id,
        Scenario: JSON.stringify({
          id: r.scenario.id,
          description: r.scenario.scenario,
          categories_id: r.scenario.categories.map(c => c.id),
          source_type: r.scenario.scenario_source,
        }),
        Owner: r.owner,
        "Identified Date": r.identification_date,
        "Modified Date": r.created_at,
        CIA: r.cia.map(c => c.id),
        "Custom Id": r.custom_id,
        "Inherent Risk Likelihood Id": r.inherent_risk_likelihood,
        "Inherent Risk Impact Id": r.inherent_risk_impact,
        "Residual Risk Likelihood Id": r.residual_risk_impact,
        "Residual Risk Impact Id": r.residual_risk_likelihood,
        Notes: r.notes,
        Treatment: JSON.stringify({
          type: r.treatment,
          controls: [],
          status: r.treatment
        }),
        Tasks: [],
        "Approved": r.is_approved,
        "Archived": false,
        Vendors: []
      }))
    }
    setRegister(data);
    stopLoading();
  };

  useEffect(() => {
    fetchandSetRegister();
  }, [])

  
  const onSearch = (val) => {
    searchedValue.current = val;
    fetchandSetRegister();
  }

  // State to track which rows are selected
  const [selectedRow, setSelectedRow] = useState([]);

  const getCurrentIndex = () => {
    if (selectedRow.length === 0) return -1;
    return selectedRow[0];
  }

  // State for matched cell
  const [matchedCell, setMatchedCell] = useState([]);


  const changeFilters = (filterName, itemId) => {
    setFilters(prev => {
      // Getting prev filters array of the filter
      let currentFilters = prev[filterName];
      let updatedFilterIds;
      if (filterName === "treatment") {
        if (itemId === 0) {
          updatedFilterIds = currentFilters.includes(itemId) ? [] : [itemId];
        } else {
          updatedFilterIds = currentFilters.includes(itemId)
            ? currentFilters.filter((id) => id !== itemId)
            : [...currentFilters, itemId].filter(id => id !== 0);
        }
      } else if (filterName === "ciaCategories") {
        if (itemId === 1) {
          updatedFilterIds = currentFilters.includes(itemId) ? [] : [itemId];
        } else {
          updatedFilterIds = currentFilters.includes(itemId)
            ? currentFilters.filter((id) => id !== itemId)
            : [...currentFilters, itemId].filter(id => id !== 1);
        }
      } else if (filterName === "identified") {
        updatedFilterIds = currentFilters.includes(itemId)
          ? []
          : [itemId];
      } else {
        // If id is already in filter, remove it, else add the id
        updatedFilterIds = currentFilters.includes(itemId)
          ? currentFilters.filter((id) => id !== itemId)
          : [...currentFilters, itemId]
      }
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
        scenario_description: val.scenario,
        categories_ids: val.categories.map(category => category.id),
        likelihood_id: scores.likelihoodScores.find(score => score.score === getRiskScore(val.inherent_likelihood, true)).id,
        impact_id: scores.impactScores.find(score => score.score === getRiskScore(val.inherent_impact, false)).id,
        notes: val.notes,
        cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
        custom_id: val.customId
      }

      const { status } = await createRisk(payload);

      if (status) {
        closeScenarioDialog();
        return fetchandSetRegister(true);
      }

    } else {
      // is edit row
      const payload = {};
      const row = register[getCurrentIndex()]; 
      const prev_scenario = row.Scenario ? (JSON.parse(row.Scenario).description || "") : "";
      const prev_categories = row.Scenario ? (JSON.parse(row.Scenario).categories_id || []).sort() : [];
      const curr_scenario = val.scenario;
      const curr_categories = val.categories.map(c => c.id).sort();

      if (val.source === 0) {
        if (prev_scenario === curr_scenario && JSON.stringify(prev_categories) === JSON.stringify(curr_categories)) {} else {
          payload.scenario_description = val.scenario;
          payload.categories_ids = val.categories.map(category => category.id);
        }
      } else {
        if (prev_scenario !== curr_scenario) {
          payload.scenario_description = val.scenario;
        }
        if (JSON.stringify(prev_categories) !== JSON.stringify(curr_categories)) {
          payload.categories_ids = val.categories.map(category => category.id);
        }
      }

      if (val.owner !== row.Owner) {
        payload.owner = val.owner;
      }
      if (val.notes !== row.Notes) {
        payload.notes = val.notes;
      }
      if (val.customId !== row["Custom Id"]) {
        payload.customId = val.customId;
      }
      if (val.identified_date !== row["Identified Date"]) {
        payload.identified_date = typeof val.identified_date === "string" ? val.identified_date : val.identified_date.toDate().toISOString();
      }
      if (val.modified_date !== row["Modified Date"]) {
        payload.modified_date = typeof val.modified_date === "string" ? val.modified_date : val.modified_date.toDate().toISOString();
      }

      const cia = [];
      if (val.uncategorized) {
        cia.push(1);
      }
      if (val.confidentiality) {
        cia.push(2);
      }
      if (val.availability) {
        cia.push(3);
      }
      if (val.integrity) {
        cia.push(4);
      }
      if (JSON.stringify(cia) !== JSON.stringify(row.CIA)) {
        payload.cia = cia;
      }

      const il = scores.likelihoodScores.find(score => score.score === getRiskScore(val.inherent_likelihood, true)).id;
      if (il !== row["Inherent Risk Impact Id"]) {
        payload.inherent_likelihood = il;
      }
      const ii = scores.impactScores.find(score => score.score === getRiskScore(val.inherent_impact, false)).id;
      if (il !== row["Inherent Risk Impact Id"]) {
        payload.inherent_impact = ii;
      }

      const rl = scores.likelihoodScores.find(score => score.score === getRiskScore(val.residual_likelihood, true)).id;
      if (rl !== row["Residual Risk Likelihood Id"]) {
        payload.residual_likelihood = rl;
      }
      const ri = scores.impactScores.find(score => score.score === getRiskScore(val.residual_impact, false)).id;
      if (ri !== row["Residual Risk Impact Id"]) {
        payload.residual_impact = ri;
      }

      if (val.treatment_plan !== (row["Treatment"] ? (JSON.parse(row["Treatment"]).type || -1) : -1)) {
        payload.treatment_plan = val.treatment_plan
      }

      if (Object.keys(payload).length > 0) {
        const {status} = await updateRegister(row["ID"], payload);
        if (status) {
          closeScenarioDialog();
          return fetchandSetRegister(true);
        }
      }
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
          triggerFilters={fetchandSetRegister}
          // Selected rows
          selectedRows={selectedRow}
          // Edit button click handler
          editHandler={openEditForm}
          cols={{ allColumns, visibleColumns, hideColumn, showColumn }}
          onSearch={onSearch}
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
                resizeAfterColumns={1}
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

      <RiskFormDialog
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