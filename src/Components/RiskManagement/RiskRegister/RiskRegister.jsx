import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import RiskRegisterHeader from './RiskRegisterHeader'
import DataTable from '../../Utils/DataTable/DataTable'
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from './RiskRegisterUtils'
import { risk_register_columns, risk_register_columns_width } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterColumns'
import { getRegister, createRisk, updateRegister } from '../../../Service/RiskManagement/RiskRegister.service'
import useLoading from '../../Utils/Hooks/useLoading'
import SkeletonBox from '../../Utils/SkeletonBox'
import RiskManagementContext from '../RiskManagementContext'
import RiskRegisterFilters, { cia_categories } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters'
import RiskFormDialog from '../RiskFormDialog'
import AddActionDialog from '../AddActionDialog'
import { getLibrary } from '../../../Service/RiskManagement/RiskLibrary.service'
import { TREATMENT_NAME_ID_MAP } from '../../../assets/data/RiskManagement/RiskTreatments'
import useSlider from '../../Utils/Hooks/useSlider'
import { put } from '../../../Service/CrudFactory'

const RiskRegister = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const { categories: { categories }, owners: { owners }, scores } = useContext(RiskManagementContext);

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(RiskRegisterFilters);
  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      owners: { ...prev.owners, options: owners.map(o => ({ id: o.id, text: `${o.first_name} ${o.last_name}` })) },
      category: { ...prev.category, options: categories.map(c => ({ id: c.id, text: c.category_name })) },
      inherentRisk: { ...prev.inherentRisk, options: scores.riskScoreGroups?.map(c => ({ id: c.id, text: c.name })) || [] },
      residualRisk: { ...prev.residualRisk, options: scores.riskScoreGroups?.map(c => ({ id: c.id, text: c.name })) || [] },
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

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) => setPagination(prev => ({ ...prev, page_no: 1, page_size: size }));
  const updatePageNumber = (page) => setPagination(prev => ({ ...prev, page_no: page }));

  // Fetch library to show as select options in add risk via library option
  const [library, setLibrary] = useState([]);
  const fetchLibrary = async () => {
    const { data } = await getLibrary({ filters: {}, search: '' });
    setLibrary(data.scenarios)
  }

  // REGISTER TABLE: State to store the register table data
  const [{ risks: register }, setRegister] = useState({ risks: [] })

  const abortControllerRef = useRef(null);

  // Function to fetch register data, and set the state
  const fetchandSetRegister = async (reload, filterTrigger) => {
    const payload = {
      filters: {},
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: filterTrigger ? 1 : pagination.page_no
    };
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
      payload.filters["inherent_risk"] = filters.inherent[0];
    }
    if (filters.residual.length > 0) {
      payload.filters["residual_risk"] = filters.residual[0];
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
          ? [new Date(), (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d })()]
          : filters.identified === 1
            ? [new Date(), (() => { const d = new Date(); d.setMonth(d.getMonth() - 6); return d })()]
            : filters.identified === 2
              ? [new Date(), (() => { const d = new Date(); d.setMonth(d.getMonth() - 12); return d })()]
              : [new Date(), new Date()];
      payload.filters["identified_date"] = [dateRange[0].toISOString(), dateRange[1].toISOString()];
    }
    const currPayload = JSON.stringify(payload);
    if (currPayload === prevPayload.current && !reload) {
      return;
    }
    prevPayload.current = currPayload;

    // ABORT CONTROLLER TO CONTROL REQUESTS
    // Abort previous requests if any, before firing a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Setting up abort controller to cancel current request if immediately another is fired
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    startLoading();
    const { data } = await getRegister(payload, { signal: signal });

    let paginationData;
    if (data) {
      paginationData = {
        page_no: data.page_no,
        page_size: data.page_size,
        total_items: data.total_items,
        total_pages: data.total_pages
      }
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
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setRegister(data);
      setPagination({ ...paginationData })
      stopLoading();
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [])

  useEffect(() => {
    fetchandSetRegister();
  }, [pagination])

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
      }
      else if (filterName === 'inherent' || filterName === 'residual') {
        if (currentFilters.includes(itemId)) updatedFilterIds = [];
        else updatedFilterIds = [itemId];
      }
      else if (filterName === "ciaCategories") {
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
  const [scenarioDialog, setScenarioDialog] = useState({ open: false, isViaLibrary: false });
  const closeScenarioDialog = () => setScenarioDialog({ open: false, isViaLibrary: false });

  // CLICK handlers for add scenario options
  const addManualScenario = () => resetPageState() & setScenarioDialog({ open: true, isViaLibrary: false });
  // reset page before trying to add new scenario
  const resetPageState = () => {
    setSelectedRow([]);
  }
  const openEditForm = () => setScenarioDialog({ open: true, isViaLibrary: false })

  const addScenarioViaLibrary = () => {
    resetPageState();
    setScenarioDialog({ open: true, isViaLibrary: true })
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

  // MANAGE ADD ACTION
  const [actionDialog, setActionDialog] = useState(false);
  const closeAddActionForm = () => setActionDialog(false);

  // get options for risks
  const getRegisterOptions = () => register.length !== 0
    ? register.map(row => ({
      val: row["ID"],
      text: JSON.parse(row["Scenario"]).description,
    }))
    : []

  const handleAddActionFormSubmit = async (values) => {

    const date = new Date(values.due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      risk_id: values.risk.val,
      // description: JSON.parse(register.find(row => row.ID.toString() === values.risk.toString())["Scenario"]).description,
      description: values.action,
      due_date: formattedDate,
      assignee: owners.find(owner => owner.id.toString() === values.owner).id,
      notes: values.notes,
      task_type: "custom",
      // source_id: 1,
    }
    const res = await put('risk/tasks/', payload);
    if (res.status) {
      closeAddActionForm();
    }
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
  const { getLikelihoodScore, getImpactScore, getLikelihoodSliderValue, getImpactSliderValue } = useSlider(scores)

  const onRegisterFormSubmit = async (val) => {
    // is new row
    if (getCurrentIndex() === -1 && !scenarioDialog.isViaLibrary) {
      const payload = {
        scenario_description: val.scenario,
        categories_ids: val.categories.map(category => category.id),
        likelihood_id: scores.likelihoodScores.find(score => score.score === getLikelihoodScore(val.inherent_likelihood)).id,
        impact_id: scores.impactScores.find(score => score.score === getImpactScore(val.inherent_impact)).id,
        notes: val.notes,
        cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
        custom_id: val.customId
      }
      const { status } = await createRisk(payload);
      if (status) {
        closeScenarioDialog();
        return fetchandSetRegister(true);
      }

    }
    else if (scenarioDialog.isViaLibrary) {
      const payload = {
        scenario_id: val.scenario,
        likelihood_id: scores.likelihoodScores.find(score => score.score === getLikelihoodScore(val.inherent_likelihood)).id,
        impact_id: scores.impactScores.find(score => score.score === getImpactScore(val.inherent_impact)).id,
        cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
        notes: val.notes,
        custom_id: val.customId
      }
      const { status } = await createRisk(payload);
      if (status) {
        closeScenarioDialog();
        return fetchandSetRegister(true);
      }
    }

    else {
      // is edit row
      const payload = {};
      const row = register[getCurrentIndex()];
      const prev_scenario = row.Scenario ? (JSON.parse(row.Scenario).description || "") : "";
      const prev_categories = row.Scenario ? (JSON.parse(row.Scenario).categories_id || []).sort() : [];
      const curr_scenario = val.scenario;
      const curr_categories = val.categories.map(c => c.id).sort();

      if (val.source === 0) {
        if (prev_scenario === curr_scenario && JSON.stringify(prev_categories) === JSON.stringify(curr_categories)) { } else {
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
        payload.custom_id = val.customId;
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

      const il = scores.likelihoodScores.find(score => score.score === getLikelihoodScore(val.inherent_likelihood)).id;
      if (il !== row["Inherent Risk Impact Id"]) {
        payload.inherent_likelihood = il;
      }
      const ii = scores.impactScores.find(score => score.score === getImpactScore(val.inherent_impact)).id;
      if (il !== row["Inherent Risk Impact Id"]) {
        payload.inherent_impact = ii;
      }

      const rl = scores.likelihoodScores.find(score => score.score === getLikelihoodScore(val.residual_likelihood)).id;
      if (rl !== row["Residual Risk Likelihood Id"]) {
        payload.residual_likelihood = rl;
      }
      const ri = scores.impactScores.find(score => score.score === getImpactScore(val.residual_impact)).id;
      if (ri !== row["Residual Risk Impact Id"]) {
        payload.residual_impact = ri;
      }

      if (val.treatment_plan !== (row["Treatment"] ? (JSON.parse(row["Treatment"]).type || -1) : -1)) {
        payload.treatment = TREATMENT_NAME_ID_MAP[val.treatment_plan];
      }

      if (Object.keys(payload).length > 0) {
        const { status } = await updateRegister(row["ID"], payload);
        if (status) {
          closeScenarioDialog();
          return fetchandSetRegister(true);
        }
      }
    }
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
          // open add action form
          openAddActionForm={() => setActionDialog(true)}
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
                resizeTable={false}
                resizeAfterColumns={1}
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                headerWrapper={(text) => <HeaderCell text={text} />}
                // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
                style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                minCellWidth={visibleColumns.map(
                  (name) => risk_register_columns_width[allColumns.indexOf(name)]
                )}
                // Pagination props
                currentPage={pagination.page_no}
                pageSize={pagination.page_size}
                totalItems={pagination.total_items}
                updatePageSize={updatePageSize}
                updatePageNumber={updatePageNumber}
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
        open={scenarioDialog.open}
        closeHandler={closeScenarioDialog}
        rowIndex={getCurrentIndex()}
        row={register[getCurrentIndex()]}
        viaLibrary={scenarioDialog.isViaLibrary}
        library={library}
        autocompleteOptions={{ categories, owners: filterDropdowns.owners.options }}
        getSliderValue={{ getLikelihoodSliderValue, getImpactSliderValue }}
        scores={scores}
        onFormSubmit={onRegisterFormSubmit}
      />

      <AddActionDialog
        open={actionDialog}
        closeHandler={closeAddActionForm}
        risks={getRegisterOptions()}
        owners={owners.map(owner => ({ val: owner.id, text: `${owner.first_name} ${owner.last_name}` }))}
        isCreateAction={true}
        riskVal={register[getCurrentIndex()]}
        onFormSubmit={handleAddActionFormSubmit}
      />
    </Box>
  )
}

export default RiskRegister