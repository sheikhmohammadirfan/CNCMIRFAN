import { Box, Grid } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './Header'
import useLoading from '../../Utils/Hooks/useLoading';
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils';
import { HEADER_NAME_MAP, ROLE_COLS } from '../../../assets/data/Rbac/Roles/columns';
import { ROLES_MOCK } from '../../../assets/data/Rbac/Roles/datamock';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import RoleForm from './RoleForm';
import { addRole, deleteRole, editRole, getPermissions, getRoles } from '../../../Service/Rbac/Roles';
import DeleteConfirmationDialog from '../../Utils/DeleteConfirmationDialog';

const Roles = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // <-------------------------------- TABLE THINGIES -------------------------------->
  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  // COLUMNS FETCH
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    async function fetchSetColumns() {
      const { status, data } = await getPermissions();
      if (status) setColumns(data);
    }
    fetchSetColumns();
  }, [])

  const columnWidths = useMemo(() => {
    const permissionCellWidths = Array(columns.length).fill(250);
    const temp = [300, ...permissionCellWidths];
    return temp;

  }, [columns])

  const [roles, setRoles] = useState([]);

  const fetchSetRoles = useCallback(async () => {
    startLoading();
    const { status, data } = await getRoles()
    setRoles(data)
    stopLoading();
  }, [])

  useEffect(() => {
    fetchSetRoles()
  }, [fetchSetRoles])

  const [matchedCell, setMatchedCell] = useState([]);

  // <-------------------------------- Table data mappers -------------------------------->
  // Making consistent objects with two keys, 'id' and 'name'
  const columnsMapped = useMemo(() => ([
    { id: 0, name: "Name" },
    ...columns.map(col => ({ id: col.id, name: col.permission_name }))
  ]), [columns])

  const mapTableHeader = () => mapDataToHeader(columnsMapped)
  const mapTableBody = () =>
    generateRows(
      roles,
      columnsMapped,
      selectedRows,
      matchedCell,
      // sortingMap
    );

  // <-------------------------------- FORM THINGIES -------------------------------->

  const [roleForm, setRoleForm] = useState(false)

  const openAddForm = () => {
    setSelectedRows([]);
    setRoleForm(true)
  }
  const openEditForm = () => setRoleForm(true)

  const roleFormSubmit = async (values, roleId) => {
    const { name, ...permissions } = values;
    const permissionIds = Object.keys(permissions)
      .map(key => permissions[key])
      .filter(p => Boolean(p))
      .filter(p => p.checked)
      .map(p => p.id)

    const payload = {
      name: name,
      permissions: permissionIds
    }

    try {
      let resStatus = false;
      if (getCurrentIndex() === -1) {
        const { status } = await addRole(payload);
        resStatus = status
      }
      else {
        const { status } = await editRole(roleId, payload)
        resStatus = status
      }
      if (resStatus) {
        setRoleForm(false);
        fetchSetRoles();
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const [deleteForm, setDeleteForm] = useState(false);

  const confirmDeleteRole = async (roleId) => {
    try {
      const { status } = await deleteRole(roleId);
      if (status) return fetchSetRoles();
    }
    catch (e) {
      console.log(e)
    }
    finally {
      setDeleteForm(false);
    }
  }

  const classes = useStyle();

  return (
    <Box>

      <Header
        selectedRows={selectedRows}
        openAddForm={openAddForm}
        openEditForm={openEditForm}
        openDeleteForm={() => setDeleteForm(true)}
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
              minCellWidth={columnsMapped.map(
                (name) => columnWidths[columnsMapped.indexOf(name)]
              )}

            // Pagination props
            // currentPage={pagination.page_no}
            // pageSize={pagination.page_size}
            // totalItems={pagination.total_items}
            // updatePageSize={updatePageSize}
            // updatePageNumber={updatePageNumber}
            />
          </Grid>
        </Grid>
      }

      {roleForm &&
        <RoleForm
          open={roleForm}
          closeHandler={() => setRoleForm(false)}
          permissionsArray={columns}
          row={roles[getCurrentIndex()]}
          onFormSubmit={roleFormSubmit}
        />
      }

      {deleteForm &&
        <DeleteConfirmationDialog
          open={deleteForm}
          closeHandler={() => setDeleteForm(false)}
          deleteState={roles[getCurrentIndex()].id}
          title='Delete Role ?'
          bodyText='Deleting a role is a permanent action and cannot be done. Please understand that if this role is associated with any user, they will lose it.'
          confirmBtnText='Delete'
          confirmHandler={confirmDeleteRole}
        />
      }

    </Box>
  )
}

export default Roles