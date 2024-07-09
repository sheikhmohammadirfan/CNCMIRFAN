import { Box, Grid, Typography } from '@material-ui/core'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { HeaderCell, RowCell, generateRows, mapDataToHeader, useStyle } from './RiskLibraryUtils'
import RiskLibraryHeader from './RiskLibraryHeader';
import RiskLibraryFilters from '../../../assets/data/RiskManagement/RiskLibrary/RiskLibraryFilters';
import useLoading from '../../Utils/Hooks/useLoading';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import { getLibrary } from '../../../Service/RiskManagement/RiskLibrary.service';
import { LibraryColumns, librayColumnWidths } from '../../../assets/data/RiskManagement/RiskLibrary/LibraryColumns';
import RiskFormDialog from '../RiskFormDialog';
import { cia_categories } from '../../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters';
import { createRisk } from '../../../Service/RiskManagement/RiskRegister.service';
import RiskManagementContext from '../RiskManagementContext';
import useSlider from '../../Utils/Hooks/useSlider';

const RiskLibrary = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const { categories: { categories }, scores } = useContext(RiskManagementContext);

  const prevPayload = useRef("");
  const searchedValue = useRef("");
  const [filters, setFilters] = useState({
    categories: [],
    register: [],
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

  const abortControllerRef = useRef(null);

  // State to save library
  const [{ scenarios: library }, setLibrary] = useState({ scenarios: [] });
  const fetchLibrary = async () => {
    const payload = {
      filters: {},
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no
    };
    if (filters.categories.length > 0) {
      payload.filters["categories"] = filters.categories;
    }
    if (filters.register.length > 0) {
      payload.filters["register"] = filters.register[0];
    }
    const currPayload = JSON.stringify(payload);
    if (currPayload === prevPayload.current) {
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
    const { data } = await getLibrary(payload, { signal: signal });
    let paginationData = {
      page_no: data.page_no,
      page_size: data.page_size,
      total_items: data.total_items,
      total_pages: data.total_pages
    }
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setLibrary({
        ...data,
        scenarios: data.scenarios.map(x => ({
          ...x,
          "Scenario": x.scenario,
          "Categories": x.categories,
          "Source": x.scenario_source === 0 ? "SYSTEM" : "CUSTOM"
        }))
      });
      setPagination({ ...paginationData })
      stopLoading();
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [pagination])

  // Save library columns
  const [libraryColumns, setLibraryColumns] = useState(LibraryColumns);

  // State to track selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  const [matchedCell, setMatchedCell] = useState([]);

  const [filterDropdowns, setFilterDropdowns] = useState(RiskLibraryFilters);
  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      categories: { ...prev.categories, options: categories.map(c => ({ id: c.id, text: c.category_name })) }
    }))
  }, [categories])


  const changeFilters = (filterName, itemId) => {
    setFilters(prev => {
      // Getting prev filters array of the filter
      let currentFilters = prev[filterName];
      let updatedFilterIds;
      if (filterName === "register") {
        // If id is already in filter, remove it, else add the id
        updatedFilterIds = currentFilters.includes(itemId)
          ? []
          : [itemId];
      } else {
        // If id is already in filter, remove it, else add the id
        updatedFilterIds = currentFilters.includes(itemId)
          ? currentFilters.filter((id) => id !== itemId)
          : [...currentFilters, itemId];
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

  const [addRiskForm, setAddRiskForm] = useState(false);
  const closeRiskForm = () => setAddRiskForm(false);

  const { getLikelihoodScore, getImpactScore, getLikelihoodSliderValue, getImpactSliderValue } = useSlider(scores)

  const onAddFormSubmit = async (val) => {
    const payload = {
      scenario_id: library[getCurrentIndex()].id,
      likelihood_id: scores.likelihoodScores.find(score => score.score === getLikelihoodScore(val.inherent_likelihood)).id,
      impact_id: scores.impactScores.find(score => score.score === getImpactScore(val.inherent_impact)).id,
      notes: val.notes,
      cia: cia_categories.filter(cia => Boolean(val[cia.name])).map(cia => cia.id),
      custom_id: val.customId
    }
    const { status } = await createRisk(payload);
    if (status) {
      closeRiskForm();
    }
  }

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(libraryColumns);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      library,
      libraryColumns,
      selectedRows,
      matchedCell,
      categories
      // sortingMap
    );

  const classes = useStyle();

  const onSearch = (val) => {
    searchedValue.current = val;
    fetchLibrary();
  }

  return (
    <Box className={classes.libraryContainer}>

      <Box className={classes.libraryHead}>
        <Typography className={classes.libraryTitle}>Falcon Risk Library</Typography>
        {/* <Typography className={classes.libraryCaption}>
          Select the risks that apply to your business and track them on your risk register.
        </Typography> */}
      </Box>

      <RiskLibraryHeader
        // Selected rows
        selectedRows={selectedRows}
        // Dropdown data for filters
        tableFilters={filterDropdowns}
        filters={{ filters, changeFilters, clearFilters, triggerFilters: fetchLibrary }}
        // function to open add risk form on clicking add button
        openAddRiskForm={() => setAddRiskForm(true)}
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
              resizeAfterColumns={0}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={libraryColumns.map(
                (name) => librayColumnWidths[libraryColumns.indexOf(name)]
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

      <RiskFormDialog
        open={addRiskForm}
        closeHandler={closeRiskForm}
        rowIndex={getCurrentIndex()}
        row={library[getCurrentIndex()]}
        isLibraryRow={true}
        autocompleteOptions={{ categories }}
        getSliderValue={{ getLikelihoodSliderValue, getImpactSliderValue }}
        scores={scores}
        onFormSubmit={onAddFormSubmit}
      />
    </Box>
  )
}

export default RiskLibrary