import React, { useCallback, useEffect, useState } from 'react'
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
import { put } from '../../../Service/CrudFactory';
import { HEADER_TABLE_NAME_MAP } from '../../../assets/data/RiskManagement/RiskLibrary/LibraryColumns';

const ActionTracker = ({
  owners: { owners, getOwners }
}) => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // ACTIONS TABLE: State to store the action table data
  const [actions, setActions] = useState([])

  // Function to fetch actions data, and set the state
  const fetchandSetActionTable = useCallback(async (owners) => {
    startLoading();
    const { data } = await getActions({
      search: '',
      filters: {},
    }
    );
    console.log(data.data);
    setActions(data.data.actions);
    stopLoading();
  }, [])

  useEffect(() => {
    fetchandSetActionTable(owners);
  }, [])

  const [columns, setColumns] = useState(ACTION_TRACKER_COLUMNS);

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(actionTrackerFilters);
  useEffect(() => {
    setFilterDropdowns(prev => ({
      ...prev,
      assignee: { ...prev.assignee, options: owners }
    }))
  }, [owners])

  const [filters, setFilters] = useState({
    assignee: [],
    falcon_status: [],
    integration_status: []
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
      const { data } = await getRegister()
      // console.log(owners);
      // console.log(data.map(row => ({ id: row["ID"], val: JSON.parse(row["Scenario"]).description })));
      setRegister(() => data.risks.map(row => ({
        val: row.id,
        text: row.scenario.scenario,
      })));
    })()
  }, [owners])

  const [actionDialog, setActionDialog] = useState(false);
  const openAddActionForm = () => setActionDialog(true);
  const closeAddActionForm = () => setActionDialog(false);

  const handleAddActionFormSubmit = async (values) => {

    const date = new Date(values.due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      risk_id: values.risk,
      description: register.find(row => row.val === values.risk).text,
      due_date: formattedDate,
      assignee: owners.find(owner => owner.val === values.owner)?.id || '',
      notes: values.notes,
      task_type: 'custom',
      // source_id: 1,
    }
    const res = await put('risk/tasks/', payload);
    setActionDialog(false);
  }

  const getColumns = () => {
    const mappedCols = columns.map(colName => HEADER_TABLE_COLS_MAP[colName]);
    return mappedCols
  }

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(columns);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      actions,
      getColumns(),
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
        selectedRows={selectedRows}
        openAddActionForm={openAddActionForm}
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
              minCellWidth={columns.map(
                (name) => ACTION_TABLE_COL_WIDTHS[columns.indexOf(name)]
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

      <AddActionDialog
        open={actionDialog}
        closeHandler={closeAddActionForm}
        risks={register}
        owners={owners}
        onFormSubmit={handleAddActionFormSubmit}
      />

    </Box>
  )
}

export default ActionTracker