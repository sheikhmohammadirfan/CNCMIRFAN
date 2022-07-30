import {
  Checkbox,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import DataTableFooter from "./DataTableFooter";
import useDragResize from "./useDragResize";
import useRowSelect from "./useRowSelect";
import PropTypes from "prop-types";
import { propsRequiredIF, PropType_Component } from "../Utils";

/** CSS classe generator */
const useStyles = makeStyles((theme) => ({
  // Root table style
  root: {
    border: `2px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    maxHeight: "100%",
    overflow: "auto",
    "& > table": { borderCollapse: "separate" },
    "&, & td, & th": { borderColor: theme.palette.grey[400] },
  },

  // Table style
  table: {
    overflow: "visible",
    width: "max-content",
    display: "grid",
    "& thead, & tbody, & tr": { display: "contents" },
    // Make cell relative to put dragger inside cell
    "& th, & td": { position: "relative", width: "100%" },
  },

  // Style for dragger handle
  resizeHandle: {
    display: "block",
    position: "absolute",
    cursor: "col-resize",
    width: 7,
    right: 0,
    top: 0,
    zIndex: 1,
    borderRight: "2px solid transparent",
    "&:hover": { borderColor: "#ccc" },
    "&.active": { borderColor: "#517ea5" },
  },

  // Highlight headr backgroud
  headerStyle: {
    "& th": { background: theme.palette.grey[200] },
    "&.sticky th": {
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  },

  headerCheckbox: {
    lineHeight: 1,
    textTransform: "none",
    marginRight: theme.spacing(1),
  },

  // Vertical border for table
  border: {
    "& tr > td:not(:last-child), & tr > th:not(:last-child)": {
      borderRight: `${theme.spacing(1 / 8)}px solid ${theme.palette.grey[400]}`,
    },
  },
}));

/** Main DataTable Component */
function DataTable({
  selectedRows = [],
  setSelectedRows,
  pageSize = 0,
  checkbox = false,
  serialNo = true,
  stickyHeader = true,
  footerComponent,
  verticalBorder = false,
  resizeTable = false,
  header = { data: [], props: {}, style: {}, cellStyle: {} },
  // data: { text = "", props = {}, css = {} },
  rowList: {
    rowData = [],
    rowProps = {},
    rowStyle = {},
    cellProps = {},
    cellStyle = {},
  },
  // rowData: { text = "", props = {}, css = {} }[],
  headerWrapper = (val) => val,
  rowWrapper = (val) => val,
  minCellWidth = 200,
  minCheckboxWidth = 50,
  className = "",
  ...rest
}) {
  const classes = useStyles();

  // Custom react hook to select and deselect row
  const {
    sliceRowLength,
    page,
    updatePage,
    rowsPerPage,
    startIndex,
    toggleRow,
    isChecked,
    toggleAllRows,
    isSomeChecked,
    isAllChecked,
  } = useRowSelect(rowData, pageSize, selectedRows, setSelectedRows);

  // Method to append Checkbox & Serial no. to Header data list
  const addColsToHeader = (data) => {
    const temp = [...data];

    if (serialNo)
      temp.unshift({
        text: <span data-test="datatable-header-serialNo">Sr. No.</span>,
        params: { serialNo: "", header: "" },
      });

    if (checkbox)
      temp.unshift({
        text: (
          <Checkbox
            color="primary"
            indeterminate={isSomeChecked()}
            checked={isAllChecked()}
            onClick={(e) => {
              toggleAllRows(e.target.checked);
              e.stopPropagation();
            }}
            data-test="datatable-header-checkbox"
            // disableRipple
            // style={{ padding: 0, margin: "0 9px" }}
          />
        ),
        params: { checkbox: "", header: "" },
      });

    return temp;
  };

  // Method to append Checkbox & Serial no. to Row data list
  const addColsToRow = (data, index) => {
    const temp = [...data];

    if (serialNo)
      temp.unshift({
        text: <span data-test="datatable-row-serialNo">{index + 1}</span>,
        params: { serialNo: "", row: "" },
      });
    if (checkbox)
      temp.unshift({
        text: (
          <Checkbox
            color="primary"
            checked={isChecked(index)}
            onChange={(e) => toggleRow(startIndex + index, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            data-test="datatable-row-checkbox"
            // disableRipple
            // style={{ padding: 0, margin: "0 9px" }}
          />
        ),
        params: { checkbox: "", row: "" },
      });

    return temp;
  };

  // HEADER
  const HEADERS = addColsToHeader(header.data);

  // Generate css grid template
  const generateTemplate = () => {
    let temp = [];
    // Check if multiple minwidth for each col is passed
    if (Array.isArray(minCellWidth)) {
      if (checkbox) temp.push(`${minCheckboxWidth}px`);
      temp = [...temp, ...minCellWidth.map((width) => `${width}px`)];
      // for (let index in minCellWidth) temp.push(`${minCellWidth[index]}px`);
    } else {
      temp = Array(HEADERS.length).fill(`${minCellWidth}px`);
      if (checkbox) temp[0] = `${minCheckboxWidth}px`;
    }
    return temp.join(" ");
  };

  // Custom hook to generate column resizer
  const { tableRef, VerticalResizer } = useDragResize(
    HEADERS.length,
    classes.resizeHandle,
    minCellWidth,
    minCheckboxWidth
  );

  return (
    <TableContainer
      className={`${classes.root} ${
        verticalBorder && classes.border
      } ${className}`}
      {...rest}
    >
      <Table
        className={resizeTable ? classes.table : ""}
        style={{ gridTemplateColumns: generateTemplate() }}
        ref={tableRef}
        data-test="datatable-table"
      >
        <TableHead
          className={`${classes.headerStyle} ${stickyHeader ? "sticky" : ""}`}
          style={header.style}
          {...header.props}
          data-test="datatable-header-container"
        >
          <TableRow>
            {HEADERS.map(({ text = "", params = {}, css = {} }, index) => (
              <TableCell
                key={index}
                {...params}
                style={{ ...header.cellStyle, ...css }}
                padding={checkbox && index === 0 ? "checkbox" : "normal"}
                data-test="datatable-header-cell"
              >
                {headerWrapper(text)}
                {resizeTable && index > 1 && (
                  <VerticalResizer index={index} data-test="column-resizer" />
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {sliceRowLength(startIndex, rowsPerPage).map(
            ({ data = [], props = {}, style = {} }, rowIndex) => (
              <TableRow
                key={rowIndex}
                {...rowProps}
                {...props}
                style={{ ...rowStyle, ...style }}
                data-test="datatable-row-container"
              >
                {addColsToRow(data, rowIndex).map(
                  ({ text = "", params = {}, css = {} }, colIndex) => (
                    <TableCell
                      key={colIndex}
                      {...cellProps}
                      {...params}
                      style={{ ...cellStyle, ...css }}
                      padding={
                        checkbox && colIndex === 0 ? "checkbox" : "normal"
                      }
                      data-test="datatable-row-cell"
                    >
                      {rowWrapper(text)}
                    </TableCell>
                  )
                )}
              </TableRow>
            )
          )}
        </TableBody>

        <DataTableFooter
          component={footerComponent}
          pageSize={pageSize}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={updatePage}
          count={rowData.length}
        />
      </Table>
    </TableContainer>
  );
}

// PropTypes for header
const PropType_HeaderCell = PropTypes.shape({
  text: PropType_Component.isRequired,
  params: PropTypes.object,
  css: PropTypes.object,
});
const PropType_HeaderRow = PropTypes.arrayOf(PropType_HeaderCell);
const PropType_Header = PropTypes.shape({
  data: PropType_HeaderRow.isRequired,
  props: PropTypes.object,
  style: PropTypes.object,
  cellStyle: PropTypes.object,
});

// PropTypes for Row
const PropType_TableCell = PropTypes.shape({
  text: PropType_Component.isRequired,
  params: PropTypes.object,
  css: PropTypes.object,
});
const PropType_TableRow = PropTypes.shape({
  data: PropTypes.arrayOf(PropType_TableCell).isRequired,
  props: PropTypes.object,
  style: PropTypes.object,
});
const PropType_TableBody = PropTypes.shape({
  rowData: PropTypes.arrayOf(PropType_TableRow).isRequired,
  rowProps: PropTypes.object,
  rowStyle: PropTypes.object,
  cellProps: PropTypes.object,
  cellStyle: PropTypes.object,
});

DataTable.propTypes = {
  selectedRows: (...params) => propsRequiredIF(...params, "checkbox", "array"),
  setSelectedRows: (...params) =>
    propsRequiredIF(...params, "checkbox", "function"),
  pageSize: PropTypes.number,
  checkbox: PropTypes.bool,
  serialNo: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  footerComponent: PropType_Component,
  verticalBorder: PropTypes.bool,
  resizeTable: PropTypes.bool,
  header: PropType_Header,
  rowList: PropType_TableBody,
  headerWrapper: PropTypes.func,
  rowWrapper: PropTypes.func,
  minCellWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  minCheckboxWidth: (...params) =>
    propsRequiredIF(...params, "checkbox", "number"),
  className: PropTypes.string,
};

export default DataTable;
