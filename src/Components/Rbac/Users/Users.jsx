import { Box, Grid } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import useLoading from '../../Utils/Hooks/useLoading';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils';
import { HEADER_NAME_MAP, SORT_NAME_MAP, USER_COL_WIDTHS, USER_COLS } from '../../../assets/data/Rbac/Users/columns';
import UserForm from './UserForm';
import UploadFileDialog from '../../Utils/UploadFileDialog';
import { COL_TOOLTIP_MAP, REQUIRED_COLUMNS } from '../../../assets/data/Rbac/Users/importCols';
import { addRole, getUsers, inviteUsers, updateUser, uploadUserSheet } from '../../../Service/Rbac/Users';
import { getRoles } from '../../../Service/Rbac/Roles';
import USER_FILTERS from '../../../assets/data/Rbac/Users/filters';
import DeleteConfirmationDialog from '../../Utils/DeleteConfirmationDialog';

const Users = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // <-------------------------------- TABLE THINGIES -------------------------------->
  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  const [columns, setColumns] = useState(USER_COLS);

  // FILTERS
  const [filterDropdowns, setFilterDropdowns] = useState(USER_FILTERS);

  // If this state has some key missing from RiskRegisterFilters.jsx in data folder, it will result in error.
  // That is why, all the keys in this state are predefined.
  const [filters, setFilters] = useState({
    role: [],
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

  const colsSearchRef = useRef({});
  const handleColumnSearch = (col, searchVal) => {
    colsSearchRef.current[col] = searchVal;
    updatePageNumber(1);
    setFilters(prev => ({
      ...prev,
      [col]: []
    }));
  }

  const prevPayload = useRef("");
  const searchedValue = useRef("");

  // USERS
  const [users, setUsers] = useState([]);

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) => {
    setPagination(prev => ({ ...prev, page_no: 1, page_size: size }));
    fetchSetUsers({ ...pagination, page_no: 1, page_size: size }, {}, filters)
  }
  const updatePageNumber = (page) => {
    setPagination(prev => ({ ...prev, page_no: page }));
    fetchSetUsers({ ...pagination, page_no: page }, {}, filters)
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
    fetchSetUsers({}, currSort, filters)
    setSorting(currSort);
  };

  const handleSearch = (searchVal) => {
    searchedValue.current = searchVal;
    updatePageNumber(1)
  }

  const abortControllerRef = useRef(null);

  const fetchSetUsers = useCallback(async (pagination, appliedSort, filters) => {
    const payload = {
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no,
    };

    if (appliedSort || sorting) {
      payload['sort_by'] = appliedSort.sort_by
      payload['sort_order'] = appliedSort.sort_order
    }

    if (filters.role.length > 0) payload['filters'] = { roles: filters.role }
    if (filters.status.length > 0) payload['status'] = filters.status

    startLoading();
    const { status, data } = await getUsers(payload);
    if (status) {
      setUsers(data.users);
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
    fetchSetUsers(pagination, sorting, filters)
  }, [filters])

  // ROLES
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function fetchRoles() {
      const { status, data } = await getRoles();
      if (status) {
        setFilterDropdowns(prev => ({
          ...prev,
          role: { ...prev.role, options: data.map(role => ({ id: role.id, text: role.name })) }
        }))
        setRoles(data)
      }
    }
    fetchRoles()
  }, [])

  const [matchedCell, setMatchedCell] = useState([]);

  // <-------------------------------- Upload File -------------------------------->
  const [uploadDialog, setUploadDialog] = useState(false);

  const onUploadSubmit = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { status } = await uploadUserSheet(formData)
    if (status) {
      setUploadDialog(false);
      fetchSetUsers(pagination, sorting, filters)
    }
    return status
  }

  // <-------------------------------- Invite Users -------------------------------->
  const [inviteConfirmatinDialog, setInviteConfirmatinDialog] = useState(false)
  const onInviteClick = () => {
    setInviteConfirmatinDialog(true);
  }
  const confirmInvite = async (rowIndexes) => {
    const userIds = rowIndexes.map(i => users[i].id)
    const payload = {
      user_ids: userIds
    }
    const { status } = await inviteUsers(payload);
    if (status) setInviteConfirmatinDialog(false);
  }

  // <-------------------------------- Table data mappers -------------------------------->
  const mapTableHeader = () => mapDataToHeader(columns, sorting, updateSort)

  const getCols = () => columns.map(col => HEADER_NAME_MAP[col])
  const mapTableBody = () =>
    generateRows(
      users,
      getCols(),
      selectedRows,
      matchedCell,
      // sortingMap
    );

  // <-------------------------------- FORM THINGIES -------------------------------->

  const [userForm, setUserForm] = useState(false);

  const openAddForm = () => {
    setSelectedRows([]);
    setUserForm(true)
  }

  const openEditForm = () => setUserForm(true);

  const userFormSubmit = async (values, rowId) => {
    const payload = getCurrentIndex() === -1 ? {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      role_ids: [values.role.id]
    } : {
      user_id: rowId,
      role_id: values.role.id,
      first_name: values.first_name,
      last_name: values.last_name,
      status: parseInt(values.status)
    }
    try {
      const { status } = getCurrentIndex() === -1 ? await addRole(payload) : await updateUser(payload)
      if (status) return fetchSetUsers(pagination, sorting, filters);
    }
    catch (e) {
      console.log(e)
    }
    finally {
      return setUserForm(false);
    }
  }

  const classes = useStyle();

  return (
    <Box>

      <Header
        openAddForm={openAddForm}
        openEditForm={openEditForm}
        openUpload={() => setUploadDialog(true)}
        openInvite={onInviteClick}
        handleSearch={handleSearch}
        tableFilters={filterDropdowns}
        activeFilters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        selectedRows={selectedRows}
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
              // style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={USER_COLS.map(
                (name) => USER_COL_WIDTHS[USER_COLS.indexOf(name)]
              )}
              // Filters
              columnFilters={filterDropdowns}
              activeFilters={filters}
              changeFilters={changeFilters}
              clearFilters={clearFilters}
              handleColumnSearch={handleColumnSearch}

              // Pagination props
              currentPage={pagination.page_no}
              pageSize={pagination.page_size}
              totalItems={pagination.total_items}
              updatePageSize={updatePageSize}
              updatePageNumber={updatePageNumber}
            />
          </Grid>
        </Grid>
      }

      {userForm &&
        <UserForm
          open={userForm}
          closeHandler={() => setUserForm(false)}
          rowIndex={getCurrentIndex()}
          row={users[getCurrentIndex()]}
          rolesList={roles.map(role => ({ id: role.id, label: role.name }))}
          onFormSubmit={userFormSubmit}
        />
      }

      <UploadFileDialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        onImport={onUploadSubmit}
        requiredColumns={REQUIRED_COLUMNS}
        col_TooltipDesc_Map={COL_TOOLTIP_MAP}
        getPlainFile
      />

      {inviteConfirmatinDialog &&
        <DeleteConfirmationDialog
          open={inviteConfirmatinDialog}
          closeHandler={() => setInviteConfirmatinDialog(false)}
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

export default Users