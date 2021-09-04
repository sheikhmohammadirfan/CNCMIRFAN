import {
  Box,
  Checkbox,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";

/** CSS classe generator */
const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1)}px 0`,
    border: `2px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

/** Main DataTable Component */
function DataTable({
  selectedRows = [],
  setSelectedRows,
  pagging = 0,
  checkbox = false,
  showIndex = false,
  header = { data: [] },
  rows = [],
  footerComponent,
}) {
  const classes = useStyles();

  // Toggle check & uncheck status of row
  const toggleRow = (index, checked) =>
    setSelectedRows((row) =>
      checked
        ? [...row, rows[index]]
        : row.filter((r) => r[0].text - 1 !== index)
    );

  // Toggle select All btn
  const toggleAllRows = (checked) => {
    setSelectedRows(
      checked ? [...rows.slice(currIn, currIn + rowsPerPage)] : []
    );
  };

  // Method to check if some files are selected
  const isSomeChecked = () =>
    selectedRows.length > 0 && selectedRows.length < getCurrMax();

  // Method to check if all files are selected
  const isAllChecked = () =>
    selectedRows.length > 0 && selectedRows.length === getCurrMax();

  // Store row per page
  const rowsPerPage = pagging ? pagging : rows.length;

  // Page index and current Starting index
  const [page, setPage] = useState(0);
  const [currIn, setCurr] = useState(0);
  const updatePage = (_, index) => {
    setPage(index);
    setCurr(index * rowsPerPage);
    setSelectedRows([]);
  };

  // Method get max row count of current page
  const getCurrMax = () =>
    currIn + rowsPerPage > rows.length ? rows.length - currIn : rowsPerPage;

  return (
    <TableContainer className={classes.root}>
      <Table>
        <TableHead>
          <TableRow {...header.row}>
            {checkbox && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={isSomeChecked()}
                  checked={isAllChecked()}
                  onClick={(e) => toggleAllRows(e.target.checked)}
                />
              </TableCell>
            )}
            {header.data.slice(Number(!showIndex)).map((val, index) => (
              <TableCell key={index} {...header.cols} {...val.props}>
                {val.text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(currIn, currIn + rowsPerPage).map((dataRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {checkbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedRows
                      .map((row) => row[0].text)
                      .includes(dataRow[0].text)}
                    onChange={(e) =>
                      toggleRow(dataRow[0].text - 1, e.target.checked)
                    }
                  />
                </TableCell>
              )}
              {dataRow.slice(Number(!showIndex)).map((dataCol, colIndex) => (
                <TableCell key={colIndex} {...dataCol.props}>
                  {dataCol.text}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <caption style={{ padding: 0 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {footerComponent}
            {pagging !== 0 && (
              <TablePagination
                rowsPerPageOptions={[]}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={updatePage}
                count={rows.length}
                component={Box}
              />
            )}
          </Box>
        </caption>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
