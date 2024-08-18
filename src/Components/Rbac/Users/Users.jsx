import { Box, Grid } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header'
import useLoading from '../../Utils/Hooks/useLoading';
import SkeletonBox from '../../Utils/SkeletonBox';
import DataTable from '../../Utils/DataTable/DataTable';
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './utils';
import { HEADER_NAME_MAP, USER_COL_WIDTHS, USER_COLS } from '../../../assets/data/Rbac/Users/columns';
import { usersMock } from '../../../assets/data/Rbac/Users/datamock';
import UserForm from './UserForm';
import UploadFileDialog from '../../Utils/UploadFileDialog';
import { COL_TOOLTIP_MAP, REQUIRED_COLUMNS } from '../../../assets/data/Rbac/Users/importCols';

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

  const [users, setUsers] = useState([]);

  const fetchSetUsers = useCallback(async () => {
    startLoading();
    await new Promise(res => setTimeout(res, 1000));
    setUsers(usersMock)
    stopLoading();
  }, [])

  useEffect(() => {
    fetchSetUsers()
  }, [fetchSetUsers])

  const [matchedCell, setMatchedCell] = useState([]);

  // <-------------------------------- Upload File -------------------------------->
  const [uploadDialog, setUploadDialog] = useState(false);

  const onUploadSubmit = async (file) => {
    console.log(file)
  }


  // <-------------------------------- Table data mappers -------------------------------->
  const mapTableHeader = () => mapDataToHeader(columns)

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

  const userFormSubmit = async (values) => {
    console.log(values)
  }

  const classes = useStyle();

  return (
    <Box>

      <Header
        openAddForm={openAddForm}
        openEditForm={openEditForm}
        openUpload={() => setUploadDialog(true)}
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
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={USER_COLS.map(
                (name) => USER_COL_WIDTHS[USER_COLS.indexOf(name)]
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

      {userForm &&
        <UserForm
          open={userForm}
          closeHandler={() => setUserForm(false)}
          rowIndex={getCurrentIndex()}
          row={users[getCurrentIndex()]}
          onFormSubmit={userFormSubmit}
        />
      }

      <UploadFileDialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        onImport={onUploadSubmit}
        requiredColumns={REQUIRED_COLUMNS}
        col_TooltipDesc_Map={COL_TOOLTIP_MAP}
      />

    </Box>
  )
}

export default Users