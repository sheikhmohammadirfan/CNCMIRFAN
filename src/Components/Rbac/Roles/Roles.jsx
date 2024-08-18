import { Box, Grid } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header'
import useLoading from '../../Utils/Hooks/useLoading';
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils';
import { HEADER_NAME_MAP, ROLE_COL_WIDTHS, ROLE_COLS } from '../../../assets/data/Rbac/Roles/columns';
import { ROLES_MOCK } from '../../../assets/data/Rbac/Roles/datamock';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import RoleForm from './RoleForm';

const Roles = () => {

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // <-------------------------------- TABLE THINGIES -------------------------------->
  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  }

  const [columns, setColumns] = useState(ROLE_COLS);

  const [roles, setRoles] = useState([]);

  const fetchSetRoles = useCallback(async () => {
    startLoading();
    await new Promise(res => setTimeout(res, 1000));
    setRoles(ROLES_MOCK)
    stopLoading();
  }, [])

  useEffect(() => {
    fetchSetRoles()
  }, [fetchSetRoles])

  const [matchedCell, setMatchedCell] = useState([]);

  // <-------------------------------- Table data mappers -------------------------------->
  const mapTableHeader = () => mapDataToHeader(columns)

  const getCols = () => columns.map(col => HEADER_NAME_MAP[col])
  const mapTableBody = () =>
    generateRows(
      roles,
      getCols(),
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

  const roleFormSubmit = async (values) => {
    console.log(values)
  }

  const classes = useStyle();

  return (
    <Box>

      <Header
        selectedRows={selectedRows}
        openAddForm={openAddForm}
        openEditForm={openEditForm}
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
              minCellWidth={ROLE_COLS.map(
                (name) => ROLE_COL_WIDTHS[ROLE_COLS.indexOf(name)]
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
          row={roles[getCurrentIndex()]}
          onFormSubmit={roleFormSubmit}
        />
      }
    </Box>
  )
}

export default Roles