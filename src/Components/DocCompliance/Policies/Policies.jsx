import React, { useEffect, useMemo, useRef, useState } from 'react'
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils'
import { Box, Grid } from '@mui/material';
import Header from './Header';
import FILTERS from '../../../assets/data/DocCompliance/Policies/Filters';
import { getUser } from '../../../Service/UserFactory';
import { COL_WIDTHS, COLUMNS, HEADER_TABLE_COLS_MAP } from '../../../assets/data/DocCompliance/Policies/Columns';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import useLoading from '../../Utils/Hooks/useLoading';
import POLICIES_MOCK from '../../../assets/data/DocCompliance/Policies/Mock';
import { useHistory } from "react-router-dom";
import Dialog from './Dialog';

const Policies = () => {

  // <--------------------------- CHECK ACCESS --------------------------->
  const hasEditPolicyAccess = useMemo(() => {
    // const user = getUser()
    // return Boolean(user.roles[0].permissions.find(p => p.permission_name === 'edit_action'))
    return true;
  }, [])

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    table: false,
    backdrop: false
  });

  // STORE POLICIES
  const [policies, setPolicies] = useState(POLICIES_MOCK);

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 10,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) =>
    setPagination((prev) => ({ ...prev, page_no: 1, page_size: size }));
  const updatePageNumber = (page) =>
    setPagination((prev) => ({ ...prev, page_no: page }));

  // SORTING
  const [sorting, setSorting] = useState(null);
  const updateSort = (colName) => {
    let currSort = {};
    if (sorting) {
      currSort = { ...sorting };
    }
    if (currSort.sort_by === HEADER_TABLE_COLS_MAP[colName]) {
      currSort.sort_order = currSort.sort_order === 1 ? -1 : 1;
    } else {
      currSort = {
        sort_by: HEADER_TABLE_COLS_MAP[colName],
        sort_order: 1,
      };
    }
    setSorting(currSort);
  };

  // <--------------------------- FILTERS --------------------------->
  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(FILTERS);
  // useEffect(() => {
  //   setFilterDropdowns((prev) => ({
  //     ...prev,
  //     assignee: {
  //       ...prev.assignee,
  //       options: owners.map((owner) => ({
  //         id: owner.id,
  //         val: owner.id,
  //         text: `${owner.first_name} ${owner.last_name}`,
  //       })),
  //     },
  //   }));
  // }, [owners]);

  const [filters, setFilters] = useState({
    status: [],
    framework: [],
  });
  const changeFilters = (filterName, updatedFilterIds) => {
    setFilters((prev) => {
      return {
        ...prev,
        [filterName]: updatedFilterIds,
      };
    });
  };
  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
  };

  const filterStringified = useRef("");
  // Whenever any filters are changed, set page to 1
  const filterTrigger = () => {
    // If filters haven't changed, return;
    if (filterStringified.current === JSON.stringify(filters)) return;
    filterStringified.current = JSON.stringify(filters);
    setPagination((prev) => ({ ...prev, page_no: 1 }));
  };

  const searchedValue = useRef("");
  const onSearch = (val) => {
    searchedValue.current = val;
    // fetchandSetActionTable();
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  };

  const [matchedCell, setMatchedCell] = useState([]);

  // <--------------------------- FORM THINGS --------------------------->
  const [dialog, setDialog] = useState(false);
  const openForm = () => setDialog(true);
  const closeForm = () => setDialog(false);

  const handleFormSubmit = async (values) => {
    console.log(values)
  }

  // <--------------------------- TABLE DATA MAPPERS --------------------------->
  const [columns, setColumns] = useState(COLUMNS);

  const mapTableHeader = () => mapDataToHeader(columns, sorting, updateSort);

  const getColumns = () => {
    const mappedCols = columns.map((colName) => HEADER_TABLE_COLS_MAP[colName]);
    return mappedCols;
  };

  const history = useHistory();
  const navigateToPolicyDetail = (id) => {
    history.push(`/doc-compliance/policies/${id}`)
  }
  const mapTableBody = () =>
    generateRows(
      policies,
      getColumns(),
      selectedRows,
      matchedCell,
      navigateToPolicyDetail
      // sortingMap
    );

  const classes = useStyle();

  return (
    <Box className={classes.policiesContainer}>
      <Header
        hasAccess={hasEditPolicyAccess}
        tableFilters={filterDropdowns}
        filters={{ filters, changeFilters, clearFilters }}
        triggerFilters={filterTrigger}
        selectedRows={selectedRows}
        openForm={openForm}
        onSearch={onSearch}
      />

      {isLoading("table") ? (
        <SkeletonBox text="Loading.." height="60vh" width="100%" />
      ) : (
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={12}>
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
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{
                borderRadius: 5,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              minCellWidth={columns.map(
                (name) => COL_WIDTHS[columns.indexOf(name)]
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
      )}

      {dialog &&
        <Dialog
          open={dialog}
          closeHandler={closeForm}
          hasAccess={hasEditPolicyAccess}
          isCreatePolicy={true}
          onFormSubmit={handleFormSubmit}
        />
      }
    </Box>
  )
}

export default Policies