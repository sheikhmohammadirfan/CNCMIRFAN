import { Typography, makeStyles } from "@material-ui/core";
import columnToCellMap from "../../../assets/data/RiskManagement/TableColCellMap";
import { HEADER_TABLE_NAME_MAP } from "../../../assets/data/RiskManagement/RiskLibrary/LibraryColumns";

export const useStyle = makeStyles((theme) => ({
  // Root Register Container
  libraryContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
  },

  libraryHead: {
    display: "flex",
    alignItems: "center",
    columnGap: 10,
  },

  libraryTitle: {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },

  libraryCaption: {
    opacity: 0.75,
    fontSize: "0.875rem",
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
    <Typography variant="body2" className={classes.tableCell}>
      {text}
    </Typography>
  );
};

export const mapDataToHeader = (columns, sorting, updateSort) => ({
  data: columns.map((text) => ({
    text,
    params: {
      onClick: text === "Categories" ? () => {} : () => updateSort(text),
      className:
        sorting &&
        (HEADER_TABLE_NAME_MAP[text] === "description"
          ? sorting.sort_by === "scenario"
          : sorting.sort_by === HEADER_TABLE_NAME_MAP[text])
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
  selectedList,
  matchedCell,
  categories,
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
      data: mapDataToRow(data[i], i, columns, matchedCell, categories),
      props: {
        selected: selectedList.indexOf(i) !== -1,
      },
    });

  // console.log(rowData);
  // console.log(rowData);
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

const mapDataToRow = (row, rowIndex, columns, matchedCell, categories) =>
  columns.map((colName) => {
    let CellComponent = colName in columnToCellMap && columnToCellMap[colName];
    let cellValue = getCellValue(row, colName, categories);
    return {
      text:
        colName in columnToCellMap ? (
          <CellComponent cellValue={cellValue} />
        ) : (
          <RowCell text={cellValue} />
        ),
      params:
        colName === "Id"
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

const getCellValue = (row, colName, categories) => {
  return row[colName];
};
