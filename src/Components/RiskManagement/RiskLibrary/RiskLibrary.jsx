import { Box, Grid, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { HeaderCell, RowCell, generateRows, mapDataToHeader, useStyle } from './RiskLibraryUtils'
import RiskLibraryHeader from './RiskLibraryHeader';
import RiskLibraryFilters from '../../../assets/data/RiskManagement/RiskLibrary/RiskLibraryFilters';
import useLoading from '../../Utils/Hooks/useLoading';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import { getLibrary } from '../../../Service/RiskManagement/RiskLibrary.service';
import { LibraryColumns, librayColumnWidths } from '../../../assets/data/RiskManagement/RiskLibrary/LibraryColumns';
import RiskFormDialog from '../RiskFormDialog';

const RiskLibrary = ({
  categories: { categories, setCategories },
  owners: { owners, getOwners },
  scores
}) => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // State to save library
  const [library, setLibrary] = useState({});
  const fetchLibrary = useCallback(async () => {
    startLoading();
    const { data } = await getLibrary();
    setLibrary(data);
    stopLoading();
  }, [])

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary])

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
      categories: { ...prev.categories, options: categories }
    }))
  }, [categories])

  const [filters, setFilters] = useState({
    categories: [],
    register: [],
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

  const [addRiskForm, setAddRiskForm] = useState(false);
  const closeRiskForm = () => setAddRiskForm(false);

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

  const onAddFormSubmit = (values) => {
    console.log(values);
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
        filters={{ filters, changeFilters, clearFilters }}
        // function to open add risk form on clicking add button
        openAddRiskForm={() => setAddRiskForm(true)}
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
              resizeAfterColumns={0}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={libraryColumns.map(
                (name) => librayColumnWidths[libraryColumns.indexOf(name)]
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

      <RiskFormDialog
        open={addRiskForm}
        closeHandler={closeRiskForm}
        rowIndex={getCurrentIndex()}
        row={library[getCurrentIndex()]}
        isLibraryRow={true}
        autocompleteOptions={{ categories }}
        getSliderValue={getSliderValue}
        scores={scores}
        onFormSubmit={onAddFormSubmit}
      />
    </Box>
  )
}

export default RiskLibrary