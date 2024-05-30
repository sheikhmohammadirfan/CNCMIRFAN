import React, { useEffect, useState } from 'react'
import { Box, Grid } from '@material-ui/core'
import RiskRegisterHeader from './RiskRegisterHeader'
import DataTable from '../../Utils/DataTable/DataTable'
import { HeaderCell, RowCell, generateRows, mapDataToHeader, useStyle } from './RiskRegisterUtils'
import { risk_register_columns, risk_register_columns_width } from '../../../assets/data/RiskRegisterColumns'
import { getRegister } from '../../../Service/RiskRegister.service'
import useLoading from '../../Utils/Hooks/useLoading'
import SkeletonBox from '../../Utils/SkeletonBox'

const RiskRegister = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  const [register, setRegister] = useState({})
  useEffect(() => {
    (async () => {
      startLoading();
      const { data } = await getRegister();
      setRegister(data)
      stopLoading();
    })()
  }, [])

  // State to track which rows are selected
  const [selectedRow, setSelectedRow] = useState([]);

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

  // Get classes from useStyle, which is in RiskRegisterUtils
  const classes = useStyle();

  // All column names into a state
  const [allColumns, setAllColumns] = useState(risk_register_columns);

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(allColumns);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      register,
      allColumns,
      selectedRow,
      matchedCell,
      // sortingMap
    );

  return (
    <Box
      className={classes.registerContainer}
    >
      <RiskRegisterHeader
        // Dropdown options click handlers
        moreOptionsHandlers={{ viewArchived, hideGuide, exportAllScenarios }}
        shareOptionsHandlers={{ createSnapshot, generateAssessmentReport, configAuditorView }}
        addScenarioOptionsHandlers={{ addManualScenario, addScenarioViaLibrary, addScenarioViaImport }}
        // activeFilters to set checked, and setFilters to handle changes
        activeFilters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        cols={{ allColumns }}
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
              serialNo={false}
              resizeTable={true}
              // selectedRows={selectedRow}
              // setSelectedRows={setSelectedRow}
              headerWrapper={(text) => <HeaderCell text={text} />}
              rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={allColumns.map(
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
  )
}

export default RiskRegister