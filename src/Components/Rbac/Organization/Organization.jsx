import { Box, Grid, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './Header'
import { HEADER_NAME_MAP, ORG_COL_WIDTHS, ORG_COLS, SORT_NAME_MAP } from '../../../assets/data/Rbac/Organization/columns'
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils'
import { usersMock } from '../../../assets/data/Rbac/Organization/datamock'
import useLoading from '../../Utils/Hooks/useLoading'
import SkeletonBox from '../../Utils/SkeletonBox'
import DataTable from '../../Utils/DataTable/DataTable'
import OrgForm from './OrgForm'
import DeleteConfirmationDialog from '../../Utils/DeleteConfirmationDialog'
import { addOrg, getOrgs, inviteUsers, updateOrg } from '../../../Service/Rbac/Organization'

const Organization = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // <-------------------------------- FILTERS -------------------------------->
  const filterDropdowns = useMemo(() => ({
    status: {
      name: "status",
      text: "Status",
      order: 2,
      options: [
        {
          id: 0,
          text: 'Inactive'
        },
        {
          id: 1,
          text: 'Active'
        },
        {
          id: 2,
          text: 'Invited'
        },
      ]
    },
  }), []);

  // If this state has some key missing from RiskRegisterFilters.jsx in data folder, it will result in error.
  // That is why, all the keys in this state are predefined.
  const [filters, setFilters] = useState({
    status: [1, 2],
  });

  const changeFilters = (filterName, updatedFilterIds) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: updatedFilterIds
    })
    )
  }

  const clearFilters = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: []
    }));
  }

  const [matchedCell, setMatchedCell] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  // <-------------------------------- COLUMNS -------------------------------->
  const columns = useMemo(() => ORG_COLS, [])

  // <-------------------------------- PAGINATION -------------------------------->
  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) => {
    setPagination(prev => ({ ...prev, page_no: 1, page_size: size }));
    fetchSetOrgs({ ...pagination, page_no: 1, page_size: size }, sorting, filters)
  }
  const updatePageNumber = (page) => {
    setPagination(prev => ({ ...prev, page_no: page }));
    fetchSetOrgs({ ...pagination, page_no: page }, sorting, filters)
  }

  // SORTING
  const [sorting, setSorting] = useState(null);
  const updateSort = (colName) => {
    let currSort = {};
    if (sorting) {
      currSort = { ...sorting };
    }
    if (currSort.sort_by === SORT_NAME_MAP[colName]) {
      currSort.sort_order = currSort.sort_order === 1 ? -1 : 1;
    } else {
      currSort = {
        sort_by: SORT_NAME_MAP[colName],
        sort_order: 1,
      };
    }
    fetchSetOrgs({}, currSort, filters)
    setSorting(currSort);
  };

  const searchedValue = useRef('')
  const handleSearch = (searchVal) => {
    searchedValue.current = searchVal;
    updatePageNumber(1)
  }

  // <-------------------------------- ACTUAL DATA -------------------------------->
  const [orgs, setOrgs] = useState([]);

  const fetchSetOrgs = useCallback(async (pagination, appliedSort, filters) => {
    const payload = {
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no,
    };

    if (appliedSort) {
      payload['sort_by'] = appliedSort.sort_by
      payload['sort_order'] = appliedSort.sort_order
    }

    if (filters?.status?.length > 0) {
      payload['status'] = filters.status
    }

    startLoading();
    const { status, data } = await getOrgs(payload);
    if (status) {
      setOrgs(data.orgs);
      setPagination({
        page_no: data.page_no,
        page_size: data.page_size,
        total_items: data.total_items,
        total_pages: data.total_pages,
      })
    }
    stopLoading();
  }, [])

  useEffect(() => {
    fetchSetOrgs(pagination, sorting, filters)
  }, [filters])

  // <-------------------------------- Table data mappers -------------------------------->
  const mapTableHeader = () => mapDataToHeader(columns, sorting, updateSort)

  const getCols = () => columns.map(col => HEADER_NAME_MAP[col])
  const mapTableBody = () =>
    generateRows(
      orgs,
      getCols(),
      selectedRows,
      matchedCell,
      // sortingMap
    );

  // <-------------------------------- FORM -------------------------------->
  const [orgForm, setOrgForm] = useState(false);
  const openAddForm = () => {
    setSelectedRows([]);
    setOrgForm(true)
  }
  const openEditForm = () => setOrgForm(true);

  const orgFormSubmit = async (values, userId) => {
    const payload = getCurrentIndex() === -1 ? {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      org_name: values.name
    } : {
      user_id: userId,
      org_name: values.name,
      first_name: values.first_name,
      last_name: values.last_name,
      status: parseInt(values.status)
      // role_id: values.role.id,
    }
    try {
      const { status } = getCurrentIndex() === -1 ? await addOrg(payload) : await updateOrg(payload)
      if (status) return fetchSetOrgs(pagination, sorting, filters);
    }
    catch (e) {
      console.log(e)
    }
    finally {
      return setOrgForm(false);
    }
  }

  // <------------------------------ INVITE FORM ------------------------------>
  const [inviteConfirmatinDialog, setInviteConfirmationDialog] = useState(false);
  const confirmInvite = async (rowIndexes) => {
    const orgIds = rowIndexes.map(r => orgs[r].admin[0].id)
    const payload = {
      user_ids: orgIds
    }
    const { status } = await inviteUsers(payload);
    if (status) setInviteConfirmationDialog(false);
  }

  // <-------------------------------- Styles -------------------------------->
  const classes = useStyle();

  return (
    <Box>
      <Header
        tableFilters={filterDropdowns}
        activeFilters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        selectedRows={selectedRows}
        openAddForm={openAddForm}
        openEditForm={openEditForm}
        openInviteForm={() => setInviteConfirmationDialog(true)}
        handleSearch={handleSearch}
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
              minCellWidth={columns.map(
                (name) => ORG_COL_WIDTHS[columns.indexOf(name)]
              )}

              //Pagination props
              currentPage={pagination.page_no}
              pageSize={pagination.page_size}
              totalItems={pagination.total_items}
              updatePageSize={updatePageSize}
              updatePageNumber={updatePageNumber}
            />
          </Grid>
        </Grid>
      }

      {orgForm &&
        <OrgForm
          open={orgForm}
          closeHandler={() => setOrgForm(false)}
          row={orgs[getCurrentIndex()]}
          onFormSubmit={orgFormSubmit}
        />
      }

      {inviteConfirmatinDialog &&
        <DeleteConfirmationDialog
          open={inviteConfirmatinDialog}
          closeHandler={() => setInviteConfirmationDialog(false)}
          deleteState={selectedRows}
          title='Invite users ?'
          bodyText={`${selectedRows.length} user${selectedRows.length > 1 ? 's' : ''} will be invited.`}
          confirmBtnText='Invite'
          confirmHandler={confirmInvite}
          className={classes.inviteDialog}
          btnVariant='primary'
        />
      }
    </Box>
  )
}

export default Organization