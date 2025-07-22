import { Typography, makeStyles } from "@material-ui/core";
import columnToCellMap from "../../../assets/data/RiskManagement/TableColCellMap";
import { HEADER_TABLE_COLS_MAP } from "../../../assets/data/RiskManagement/ActionTracker/ActionTrackerColumns";

export const useStyle = makeStyles((theme) => ({
  // Root Register Container
  actionTrackerContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
  },

  // Style for table container
  gridContainer: {
    "& > div": { maxHeight: "75vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },

  // Set table style
  tableStyle: {
    // Make row cell background white
    "& tbody td": { background: "#fff" },

    // Stop overflow
    "& tbody td:not(:first-child)": { overflow: "hidden" },

    // Stick All checkbox in table to be sticky left
    "& [checkbox]": { position: "sticky !important", left: 0, zIndex: 2 },

    // Make POA&M ID column to sticky left with offset of 50px
    "& [sticky]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },

    // Increase z-index of header
    "& [header]": {
      zIndex: "3 !important",
      "&[sticky]": { zIndex: "2 !important" },
    },

    // Add soting
    "& thead th:not(:first-child)": {
      "&::before, &::after": {
        position: "absolute",
        fontFamily: "Material Icons",
        right: 0,
        fontSize: 18,
        width: 10,
      },
      "&::before": {
        content: "'\\2193'",
        color: theme.palette.grey[400],
        display: "flex",
        top: 8,
        right: 3,
      },
      "&::after": {
        content: "'\\2191'",
        color: theme.palette.grey[400],
        top: 8,
        right: 10,
      },
      "&.asc::before": {
        content: "'\\2193'",
        color: "#4477CE",
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: "#4477CE",
      },
    },

    // Giving box shadow on left side to First cell on select
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: "inset 4px 0 0 0 #4477CE",
    },

    // Change background color of selected row CELLS
    "& tr.Mui-selected td": {
      // background: "#8ef1f1 !important",
      background: "#e2e7f0 !important",
    },

    // Update sticky col background
    // "& thead th:nth-child(1)": { background: "#cce6e3" },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    // "& tbody td:nth-child(1)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },

    // searched data cell style
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },
  },

  //Header cell style
  headerCell: {
    color: "#797979",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  // Style to make all cell height of 3 line
  tableCell: {
    overflow: "hidden",
    userSelect: "none",
  },

  cellLabel: {
    padding: "3px 10px",
    fontSize: "0.8rem",
    // backgroundColor: "rgba(0, 0, 0, 0.05)",
    color: "rgba(0, 0, 0, 0.75)",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "50px",
  },

  // Backdrop style when export is loading
  backdrop: {
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    color: "white",
    "&  .backdrop-label": {
      marginTop: 10,
      fontWeight: "bold",
      letterSpacing: 1,
      fontStyle: "italic",
    },
  },

  formContainer: {
    "& .MuiDialogContent-root": {
      padding: "24px",
    },
  },
}));

/* Header cell component */
export const HeaderCell = ({ text }) => {
  const classes = useStyle();
  return (
    <Typography noWrap variant="body1" className={classes.headerCell}>
      {text}
    </Typography>
  );
};

/* Row cell component */
export const RowCell = ({ text }) => {
  const classes = useStyle();
  return (
    <Typography variant="body2" noWrap className={classes.tableCell}>
      {text === "load" ? "Loading ..." : text}
    </Typography>
  );
};

export const mapDataToHeader = (columns, sorting, updateSort) => ({
  data: columns.map((text) => ({
    text,
    params:
      text === "ID"
        ? {
            sticky: "true",
            header: "true",
            onClick: () => updateSort(text),
            className:
              sorting && sorting.sort_by === HEADER_TABLE_COLS_MAP[text]
                ? sorting.sort_order === 1
                  ? "asc"
                  : "dsc"
                : "",
          }
        : {
            onClick: () => updateSort(text),
            className:
              sorting && sorting.sort_by === HEADER_TABLE_COLS_MAP[text]
                ? sorting.sort_order === 1
                  ? "asc"
                  : "dsc"
                : "",
          },
  })),
  cellStyle: {
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
});

export const generateRows = (
  data,
  columns,
  register,
  owners,
  selectedList,
  matchedCell,
  sortingMap
) => {
  // count of number of rows
  const rowCount = data.length;
  // output 2D list
  const rowData = [];

  if (sortingMap) {
  }

  // Generate row of POA&M table
  for (let i = 0; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(data[i], i, register, owners, columns, matchedCell),
      props: {
        selected: selectedList.indexOf(i) !== -1,
      },
    });

  return {
    rowData,
    rowStyle: { cursor: "pointer" },
    cellStyle: {
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
  };
};

const mapDataToRow = (row, rowIndex, register, owners, columns, matchedCell) =>
  columns.map((colName) => {
    let CellComponent = colName in columnToCellMap && columnToCellMap[colName];
    let cellValue = getCellValue(row, colName, register, owners);
    return {
      text:
        colName in columnToCellMap ? (
          <CellComponent cellValue={cellValue} />
        ) : (
          <RowCell text={cellValue} />
        ),
      params:
        colName === "id"
          ? {
              sticky: "",
              "data-searched": Boolean(
                matchedCell.find(
                  (cell) =>
                    cell.column === colName &&
                    cell.row === rowIndex &&
                    cell.selected === true
                )
              ),
              tabIndex: 0,
            }
          : {
              "data-searched": Boolean(
                matchedCell.find(
                  (cell) =>
                    cell.column === colName &&
                    cell.row === rowIndex &&
                    cell.selected === true
                )
              ),
              tabIndex: 0,
            },
    };
  });

const getCellValue = (row, colName, register, owners) => {
  if (colName === "risk") {
    if (register.length === 0) return "load";
    else return register.find((r) => r.val === row.poam_row)?.text || "-";
  } else if (colName === "owner") {
    if (owners.length === 0) return "load";
    let owner = owners.find((owner) => owner.id === row.assignee);
    return `${owner?.first_name} ${owner?.last_name}`;
  } else return row[colName];
};

export const FILTER_HANDLERS = {
  internal_status: (currentFilters, checkedId) => {
    return currentFilters.includes(checkedId) ? [] : [checkedId];
  },
};
