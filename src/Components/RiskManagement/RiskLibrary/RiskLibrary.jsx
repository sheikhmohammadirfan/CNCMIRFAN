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

const RiskLibrary = ({
  categories: { categories, setCategories },
  owners: { owners, getOwners },
  scores: { likelihoodScores, setLikelihoodScores, impactScores, setImpactScores }
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
        // Dropdown data for filters
        tableFilters={filterDropdowns}
        filters={{ filters, changeFilters, clearFilters }}
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
    </Box>
  )
}

export default RiskLibrary