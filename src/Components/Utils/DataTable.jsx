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
import React, { useEffect } from "react";
import { useState } from "react";

/** CSS classe generator */
const useStyles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(1)}px 0`,
    border: `2px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    "&, &  td, & th": {
      borderColor: theme.palette.grey[400],
    },
  },
  headerStyle: {
    background: theme.palette.grey[200],
  },
  stickTop: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    boxShadow: theme.shadows[1],
  },
  border: {
    "& tr > td:not(:first-child), & tr > th:not(:first-child)": {
      borderLeft: `${theme.spacing(1 / 8)}px solid ${theme.palette.grey[400]}`,
    },
  },
}));

/** Main DataTable Component */
function DataTable({
  selectedRows = [],
  setSelectedRows,
  pagging = 0,
  checkbox = false,
  serialNo = true,
  header = { data: [], props: {}, style: {}, cellStyle: {} },
  rowList = [],
  footerComponent,
  verticalBorder = false,
  stickHeader = true,
  ...rest
}) {
  const classes = useStyles();

  // Page index and current Starting index
  const [page, setPage] = useState(0);
  const [startIndex, setStart] = useState(0);
  const updatePage = (_, index) => {
    setPage(index);
    setStart(index * rowsPerPage);
    setSelectedRows([]);
  };

  // Method to add row
  const addRow = (index) => [...selectedRows, index];

  // Method to remove row
  const removeRow = (index) => selectedRows.filter((i) => i != index);

  // Method to splice row from start till length
  const sliceRowLength = (start, length) =>
    rowList.slice(start, start + length);

  // Method to check if row in list
  const containRow = (index) => selectedRows.some((i) => i == index);

  // Toggle check & uncheck status of row
  const toggleRow = (index, checked) =>
    setSelectedRows(() => (checked ? addRow(index) : removeRow(index)));

  // Toggle select All btn
  const toggleAllRows = (checked) =>
    setSelectedRows(() =>
      checked
        ? Array.from(
            Array(sliceRowLength(startIndex, rowsPerPage).length).keys()
          )
        : []
    );

  // Method to check if some files are selected
  const isSomeChecked = () =>
    selectedRows.length > 0 && selectedRows.length < getCurrMax();

  // Method to check if all files are selected
  const isAllChecked = () =>
    selectedRows.length > 0 && selectedRows.length === getCurrMax();

  // Method get max row count of current page
  const getCurrMax = () =>
    startIndex + rowsPerPage > rowList.length
      ? rowList.length - startIndex
      : rowsPerPage;

  // Store row per page
  const rowsPerPage = pagging ? pagging : rowList.length;

  return (
    <TableContainer
      className={`${classes.root} ${
        verticalBorder && classes.border
      } custom-sidebar`}
      {...rest}
    >
      <Table>
        <TableHead
          className={`${classes.headerStyle} ${
            stickHeader ? classes.stickTop : ""
          }`}
          style={header.style}
          {...header.props}
        >
          <TableRow>
            {checkbox && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={isSomeChecked()}
                  checked={isAllChecked()}
                  onClick={(e) => {
                    toggleAllRows(e.target.checked);
                    e.stopPropagation();
                  }}
                  {...header.cellStyle}
                />
              </TableCell>
            )}
            {serialNo && <TableCell {...header.cellStyle}>Sr. No.</TableCell>}
            {header.data.map(({ text = "", props = {}, style = {} }, index) => (
              <TableCell
                key={index}
                {...props}
                style={style}
                {...header.cellStyle}
              >
                {text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sliceRowLength(startIndex, rowsPerPage).map((currRow, rowIndex) => (
            <TableRow key={rowIndex} {...currRow.props} style={currRow.style}>
              {checkbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={containRow(rowIndex)}
                    onChange={(e) =>
                      toggleRow(startIndex + rowIndex, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              )}
              {serialNo && <TableCell>{rowIndex + 1}</TableCell>}
              {currRow.data.map(
                ({ text = "", props = {}, style = {} }, colIndex) => (
                  <TableCell key={colIndex} {...props} style={style}>
                    {text}
                  </TableCell>
                )
              )}
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
                count={rowList.length}
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
