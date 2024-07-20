import React, { useContext, useEffect, useRef, useState } from 'react'
import actionTrackerFilters from '../../../assets/data/RiskManagement/ActionTracker/ActionTrackerFilters'
import { Box, Grid } from '@material-ui/core';
import ActionTrackerHeader from './ActionTrackerHeader';
import AddActionDialog from '../AddActionDialog';
import { getRegister } from '../../../Service/RiskManagement/RiskRegister.service';
import useLoading from '../../Utils/Hooks/useLoading';
import { getActions } from '../../../Service/RiskManagement/ActionTracker.service';
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from './ActionTrackerUtils';
import { ACTION_TABLE_COL_WIDTHS, ACTION_TRACKER_COLUMNS, HEADER_TABLE_COLS_MAP } from '../../../assets/data/RiskManagement/ActionTracker/ActionTrackerColumns';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import { deletes, patch, put } from '../../../Service/CrudFactory';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RiskManagementContext from '../RiskManagementContext';

const ActionTracker = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Get owners from RiskManagementContext
  const { owners: { owners } } = useContext(RiskManagementContext);

  // ACTIONS TABLE: State to store the action table data
  const [actions, setActions] = useState([])

  // Saving filter values and search value
  const prevPayload = useRef("");
  const searchedValue = useRef("");

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) => setPagination(prev => ({ ...prev, page_no: 1, page_size: size }));
  const updatePageNumber = (page) => setPagination(prev => ({ ...prev, page_no: page }));

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

  const abortControllerRef = useRef(null);

  // Function to fetch actions data, and set the state
  const fetchandSetActionTable = async () => {

    const payload = {
      filters: {},
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no,
      ...sorting
    };
    if (filters.assignee.length > 0) {
      payload.filters['assignee'] = filters.assignee;
    }
    const newPayload = JSON.stringify(payload);
    if (prevPayload.current === newPayload) return;
    prevPayload.current = newPayload;

    // ABORT CONTROLLER TO CONTROL REQUESTS
    // Abort previous requests if any, before firing a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Setting up abort controller to cancel current request if immediately another is fired
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    startLoading();
    const { data, status } = await getActions(payload, { signal: signal });

    if (!status) {
      stopLoading();
      return;
    }

    let paginationData = {
      page_no: data.page_no,
      page_size: data.page_size,
      total_items: data.total_items,
      total_pages: data.total_pages
    }
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setActions(data.actions);
      setPagination({ ...paginationData })
      stopLoading();
    }
  }

  useEffect(() => {
    fetchandSetActionTable();
  }, [pagination, sorting])

  const [columns, setColumns] = useState(ACTION_TRACKER_COLUMNS);

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(actionTrackerFilters);
  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      assignee: { ...prev.assignee, options: owners.map(owner => ({ id: owner.id, val: owner.id, text: `${owner.first_name} ${owner.last_name}` })) }
    }))
  }, [owners])

  const [filters, setFilters] = useState({
    assignee: [],
    falcon_status: [],
    integration_status: []
  })
  const changeFilters = (filterName, updatedFilterIds) => {
    setFilters(prev => {
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

  const filterStringified = useRef('');
  // Whenever any filters are changed, set page to 1
  const filterTrigger = () => {
    // If filters haven't changed, return;
    if (filterStringified.current === JSON.stringify(filters)) return;
    filterStringified.current = JSON.stringify(filters);
    setPagination(prev => ({ ...prev, page_no: 1 }))
  }

  const onSearch = (val) => {
    searchedValue.current = val;
    fetchandSetActionTable();
  }

  const [selectedRows, setSelectedRows] = useState([])
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  const [matchedCell, setMatchedCell] = useState([]);

  // Needed to show in add action form dropdown
  const [register, setRegister] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getRegister({ filters: {}, search: '', page_size: 30 })
      setRegister(data.risks);
    })()
  }, [owners])

  const [actionDialog, setActionDialog] = useState(false);
  const openAddActionForm = () => setActionDialog(true);
  const closeAddActionForm = () => setActionDialog(false);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // get options for risks
  const getRegisterOptions = () => register.length !== 0
    ? register.map(row => ({
      val: row.id,
      text: row.scenario.scenario,
    }))
    : []

  const handleAddActionFormSubmit = async (values, isCreateAction) => {

    const date = new Date(values.due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      risk_id: values.risk.val,
      description: values.action,
      due_date: formattedDate,
      assignee: owners.find(owner => owner.id === values.owner)?.id || '',
      notes: values.notes,
      task_type: 'custom',
      // source_id: 1,
    }

    let res;
    if (isCreateAction) {
      res = await put('risk/tasks/', payload);
      if (res.status) {
        setActions(prev => ([
          ...prev,
          {
            ...payload,
            files: [],
            id: res.data.task_id,
            risk: {
              id: payload.risk_id,
              is_approved: register.find(row => row.id === payload.risk_id).is_approved,
              owner: payload.assignee,
              scenario: register.find(row => row.id === payload.risk_id).scenario.id
            },
            source: 'Custom',
            status: 1,
            task: payload.description,
          }
        ]))
      };
    }
    else {
      const idToUpdate = actions[getCurrentIndex()].id;
      res = await patch(`risk/tasks/${idToUpdate}`, payload)
      if (res.status) {
        setActions(prev => prev.map(action => action.id === idToUpdate ? {
          ...action,
          ...payload,
          task: payload.description,
        } : { ...action }))
      }
    }
    setActionDialog(false);
  }

  const deleteAction = async () => {
    const idToDelete = actions[getCurrentIndex()].id;
    const res = await deletes(`/risk/tasks/${idToDelete}`);
    if (res.status) {
      setActions(prev => prev.filter(action => action.id !== idToDelete));
    }
    setDeleteConfirmationOpen(false);
  }

  const getColumns = () => {
    const mappedCols = columns.map(colName => HEADER_TABLE_COLS_MAP[colName]);
    return mappedCols
  }

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(columns, sorting, updateSort);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      actions,
      getColumns(),
      register,
      owners,
      selectedRows,
      matchedCell,
      // sortingMap
    );

  const classes = useStyle();

  return (
    <Box className={classes.actionTrackerContainer}>

      <ActionTrackerHeader
        tableFilters={filterDropdowns}
        filters={{ filters, changeFilters, clearFilters }}
        triggerFilters={filterTrigger}
        selectedRows={selectedRows}
        openAddActionForm={openAddActionForm}
        openDeleteConfirmationDialog={() => setDeleteConfirmationOpen(true)}
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
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={columns.map(
                (name) => ACTION_TABLE_COL_WIDTHS[columns.indexOf(name)]
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

      <AddActionDialog
        open={actionDialog}
        closeHandler={closeAddActionForm}
        risks={getRegisterOptions()}
        actionVal={actions[getCurrentIndex()]}
        isCreateAction={getCurrentIndex() === -1}
        owners={owners.map(owner => ({ val: owner.id, text: `${owner.first_name} ${owner.last_name}` }))}
        onFormSubmit={handleAddActionFormSubmit}
      />

      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        closeHandler={() => setDeleteConfirmationOpen(false)}
        deleteAction={deleteAction}
      />

    </Box>
  )
}

export default ActionTracker