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
import useDragResize from "./useDragResize";
import useRowSelect from "./useRowSelect";
import PropTypes from "prop-types";
import { propsRequiredIF, PropType_Component } from "../Utils";
import useHeightResize from "./useHeightResize";
import { TextControl } from "../Control";
import DataTableHeader from "./DataTableHeader";
import { Box, Icon, InputAdornment } from "@mui/material";
import FilterDropdown from "./FilterDropdown";
import { debounce } from "lodash";

/** CSS classe generator */
const useStyles = makeStyles((theme) => ({
  // Root table style
  root: {
    border: `1px solid #d9d9d9`,
    borderTop: 0,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // maxHeight: "100%",
    // overflow: "auto",
    "& > table": { borderCollapse: "separate" },
    // "&, & td, & th": { borderColor: theme.palette.grey[400] },
    "& tr:last-child td": {
      borderBottom: "none",
    },
  },

  // Table style
  table: {
    maxWidth: "100%",
    maxHeight: "65vh",
    overflow: "auto",
    display: "grid",
    "& thead, & tbody, & tr": { display: "contents" },
    // Make cell relative to put dragger inside cell
    "& th, & td": { position: "relative", width: "100%" },

    "& td > div": {
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
    },
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

  // Style for dragger handle
  expandHandle: {
    display: "block",
    position: "absolute",
    cursor: "row-resize",
    height: 7,
    left: 0,
    bottom: 0,
    zIndex: 1,
    borderBottom: "2px solid transparent",
    "&:hover": { borderColor: "#ccc" },
    "&.active": { borderColor: "#517ea5" },
  },

  // Highlight headr backgroud
  headerStyle: {
    "& th": {
      background: "#f4f4f4",
      borderColor: "#d9d9d9",
      border: "1px solid",
      borderLeft: 0,
      userSelect: "none",
    },
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
      borderRight: `${theme.spacing(1 / 8)}px solid ${theme.palette.grey[200]}`,
    },
  },

  // Style for highlighting searched word
  searchHighlight: {
    backgroundColor: "yellow",
    display: "inline-block",
  },

  // Style for highlighting row that the user is hovering over
  tableRowHover: {
    cursor: "pointer",
    "&:hover": {
      "& > *": {
        // Apply to all children cells
        backgroundColor: "#F4F4F4",
      },
    },
  },

  searchFilter: {
    width: "100%",
    "& .MuiInputBase-root": {
      paddingRight: "0",
    },
    "& input": {
      padding: "7px",
    },
  },
}));

/** Main DataTable Component */
function DataTable({
  selectedRows = [],
  setSelectedRows,
  currentPage,
  pageSize = 0,
  totalItems,
  updatePageSize,
  updatePageNumber,
  checkbox = false,
  serialNo = true,
  stickyHeader = true,
  footerComponent,
  verticalBorder = false,
  resizeTable = false,
  resizeAfterColumns = 1,
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
  searchTerm = "",
  // Filtering
  columnFilters = {},
  activeFilters = {},
  changeFilters = () => {},
  clearFilters = () => {},
  handleColumnSearch = () => {},
  activeColumnsSearched = {},
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
  } = useRowSelect(
    currentPage,
    rowData,
    pageSize,
    selectedRows,
    setSelectedRows,
  );

  const handleRowsPerPageChange = (e) => {
    updatePageSize(e.target.value);
  };

  const handlePageChange = (e, pageNumber) => {
    updatePageNumber(pageNumber + 1);
    return updatePage(null, pageNumber);
  };

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
  const generateColumns = () => {
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
    minCheckboxWidth,
    header,
  );

  const HeightResizer = useHeightResize(
    rowData.length + 1,
    classes.expandHandle,
    50,
    tableRef,
    rowData,
  );

  // Function to highlight search term in text
  const highlightSearchTerm = (text) => {
    if (!searchTerm || typeof text !== "string") return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span className={classes.searchHighlight}>{part}</span>
      ) : (
        part
      ),
    );
  };

  const getfilterRow = () => {
    const temp = [...header.data];
    if (checkbox) {
      temp.unshift({
        text: "",
        params: {},
        css: { position: "sticky", left: 0, zIndex: 2 },
      });
    }
    return temp;
  };

  const hasFilterColumn = Boolean(
    getfilterRow().find((c) => Boolean(c.filterType)),
  );

  return (
    <TableContainer
      className={`${classes.root} ${
        verticalBorder && classes.border
      } ${className}`}
      {...rest}
    >
      <DataTableHeader
        component={footerComponent}
        pageSize={pageSize}
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        onPageChange={handlePageChange}
        count={totalItems}
      />
      <Table
        className={classes.table}
        style={{
          gridTemplateColumns: generateColumns(),
        }}
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
                {resizeTable && index > resizeAfterColumns && (
                  <VerticalResizer index={index} data-test="column-resizer" />
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* FILTERS ROW (1st ROW) */}
          {hasFilterColumn && (
            <TableRow data-test="datatable-row-container">
              {getfilterRow().map((r, i) => (
                <TableCell
                  key={i}
                  style={{
                    ...r.css,
                    display: "flex",
                    alignItems: "center",
                    ...r.filterCellCss,
                  }}
                  padding={checkbox && i === 0 ? "checkbox" : "normal"}
                  data-test="datatable-row-cell"
                >
                  {r.filterType?.includes("text") ? (
                    <TextControl
                      defaultValue={activeColumnsSearched?.[r.colName]}
                      type="search"
                      variant="outlined"
                      gutter={false}
                      size="small"
                      className={classes.searchFilter}
                      InputProps={{
                        placeholder: `${r.text}`,
                        endAdornment: r.filterType.includes("filter") &&
                          r.colName in columnFilters && (
                            <InputAdornment position="end">
                              <FilterDropdown
                                key={i}
                                filterName={columnFilters[r.colName].name}
                                buttonText={
                                  <Icon sx={{ fontSize: "1.2rem" }}>
                                    filter_alt
                                  </Icon>
                                }
                                filterOptions={columnFilters[r.colName].options}
                                activeFilters={
                                  activeFilters[columnFilters[r.colName].name]
                                }
                                changeFilters={changeFilters}
                                clearFilters={clearFilters}
                                filterHandlerMap={{}}
                                //   contextLoading={contextLoading}
                                // filterMetadata={filterMetadata}
                                dropdownPlacement="bottom-end"
                              />
                            </InputAdornment>
                          ),
                      }}
                      onChange={debounce(
                        (e) => handleColumnSearch(r.colName, e.target.value),
                        1000,
                      )}
                    />
                  ) : r.filterType?.includes("filter") &&
                    r.colName in columnFilters ? (
                    <Box width="100%">
                      <FilterDropdown
                        key={i}
                        filterName={columnFilters[r.colName].name}
                        buttonText={columnFilters[r.colName].text}
                        filterOptions={columnFilters[r.colName].options}
                        activeFilters={
                          activeFilters[columnFilters[r.colName].name]
                        }
                        changeFilters={changeFilters}
                        clearFilters={clearFilters}
                        filterHandlerMap={{}}
                        //   contextLoading={contextLoading}
                        // filterMetadata={filterMetadata}
                        dropdownPlacement="bottom-end"
                        buttonStyles={{ width: "100%" }}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
          {/* <----------------- FILER ROW END -----------------> */}

          {/* NO DATA FOUND ROW */}
          {rowData.length === 0 && (
            <TableRow
              data-test="datatable-no-data-row"
              style={{
                display: "contents", // Maintain grid structure
              }}
            >
              {/* First cell with the message */}
              <TableCell
                key="no-data-message"
                style={{
                  padding: "10px 20px",
                  fontStyle: "italic",
                  color: "#888",
                  backgroundColor: "#fafafa",
                  textAlign: "center",
                  fontSize: "14px",
                  borderBottom: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gridColumn: "1 / -1", // This spans all columns in CSS Grid
                  minHeight: "70px", // min-height
                }}
                data-test="datatable-no-data"
              >
                No data found.
              </TableCell>
            </TableRow>
          )}

          {/* TABLE DATA ROWS */}
          {sliceRowLength(startIndex, rowsPerPage).map(
            ({ data = [], props = {}, style = {} }, rowIndex) => (
              <TableRow
                key={rowIndex}
                {...rowProps}
                {...props}
                className={classes.tableRowHover}
                style={{ ...rowStyle, ...style }}
                data-test="datatable-row-container"
                onClick={
                  props.onClick ||
                  ((e) => toggleRow(rowIndex, !isChecked(rowIndex)))
                }
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
                      {rowWrapper(
                        highlightSearchTerm(text),
                        params.colname,
                        rowIndex,
                        colIndex,
                      )}
                      {resizeTable && colIndex === 0 && (
                        <HeightResizer index={rowIndex + 1} />
                      )}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
      {/* <DataTableFooter
        component={footerComponent}
        pageSize={pageSize}
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        onPageChange={handlePageChange}
        count={totalItems}
      /> */}
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
  searchTerm: PropTypes.string,
};

export default DataTable;
