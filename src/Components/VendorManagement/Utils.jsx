import { Typography, makeStyles } from "@material-ui/core";
import columnToCellMap from "./ColCellMap";

export const useStyle = makeStyles((theme) => ({
  // Root Container
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    maxWidth: "-webkit-fill-available",
    overflow: "hidden",
    margin: "15px",
  },

  // Style for table container
  gridContainer: {
    "& > div": { maxHeight: "75vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },

  // Set table style
  tableStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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

    "& [sticky][scenario=true]": {
      left: 200,
    },

    // Increase z-index of header
    "& [header]": {
      zIndex: "3 !important",
      "&[sticky]": { zIndex: "2 !important" },
    },

    // Add sorting
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
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": {
      borderRight: `1px solid ${theme.palette.grey[300]}`,
    },

    // searched data cell style
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },
  },

  // Header cell style
  headerCell: {
    color: "#797979",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  // Style to make all cell height of 3 line
  tableCell: {
    whiteSpace: "pre",
    overflow: "hidden",
    userSelect: "none",
  },

  cellLabel: {},

  cellCategory: {
    fontSize: "0.8rem",
    color: "rgba(128,128,128)",
  },

  statusCell: {
    padding: "4px 8px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    fontSize: "0.8rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  riskScore: {
    borderRadius: "16px",
    padding: "3px 10px",
    color: "rgba(0, 0, 0, 0.75)",
  },

  // Style for tab switching button
  tabButtonGroup: {
    textTransform: "none",
    // paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "& > .MuiButton-root": {
      color: "#b3b3b3",
      borderColor: "#d9d9d9",
      border: "none",
      borderBottom: "3px solid #d9d9d9",
      "&:nth-child(1)": { borderRadius: "4px 0 0 0" },
      "&:nth-child(2)": { borderRadius: "0 4px 0 0" },
      "&:disabled": {
        color: "#4477CE",
        borderColor: theme.palette.primary.main,
      },
    },
  },

  tabButton: {
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#f4f4f4",
    },
  },

  //Sidebar styles
  sidebarOpen: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 2,
    marginTop: 10,
    height: "75vh",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
  },
  sidebarClose: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 2,
    marginTop: 10,
    height: "70vh",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
  },
  vdContainer: {
    width: '100%',
    margin: 0,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },

  //Table container style
  tableOpen: {
    marginLeft: 10,
    marginRight: 4,
    marginTop: 20,
    width: "100%",
  },
  tableClose: {
    marginLeft: 10,
    marginRight: 4,
    marginTop: 20,
    width: "100%",
  },
  
  button: {
    textTransform: "none",
  },
  
  // Style for loader
  backdrop: {
    zIndex: 1000000,
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
}));

// Colors for the risk cells
export const RiskColorMap = {
  Low: "#81c784", // Green
  Medium: "#ffd54f", // Yellow
  High: "#e57373", // Red
  Critical: "#d32f2f", // Dark Red
  Unknown: "#9e9e9e", // Grey
  default: "#ffffff", // Default color (white)
};

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
      {text}
    </Typography>
  );
};

/* Method to map visible columns to header row */
export const mapDataToHeader = (
  visibleColumns,
  sorting,
  updateSort = () => []
) => ({
  data: visibleColumns.map((text) => ({
    text,
    params: {
      onClick: () => updateSort(text),
      className: sorting && sorting.column === text ? sorting.order : "",
    },
  })),
  cellStyle: {
    background: "#F4F4F4",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
});

/* Method to map data to row dictionary */
const mapDataToRow = (row, rowIndex, columns, matchedCell = []) =>
  columns.map((colName) => {
    let CellComponent = columnToCellMap[colName];
    let cellValue = row[colName];
    const columnMapping = {
      "NAME / CATEGORY": { name: row.vendor_name, category: row.category },
      "SOURCE": row.source,
      "INHERENT RISK": row.inherent_risk,
      "# OF ACCOUNTS": row.number_of_accounts,
      "DATE DISCOVERED": row.date_discovered,
      "SECURITY OWNER": row.owner,
      "SECURITY REVIEW": row.review,
      "LAST REVIEWED": row.last_date,
    };

    if (cellValue === undefined) {
      cellValue = columnMapping[colName]
    }

    return {
      text: CellComponent ? (
        <CellComponent cellValue={cellValue} />
      ) : (
        <RowCell text={cellValue} />
      ),
      params: {
        "data-searched": Boolean(
          matchedCell &&
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

/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  columns,
  selectedList,
  matchedCell = [],
  handleRowClick = () => {},
  rowStyle = {}
) => {
  // count of number of rows
  const rowCount = data.length;
  // output 2D list
  const rowData = [];

  // Generate row of table
  for (let i = 0; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(data[i], i, columns, matchedCell),
      props: {
        selected: selectedList.indexOf(i) !== -1,
        onClick: () => handleRowClick(i),
      },
    });

  return {
    rowData,
    cellStyle: {
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
  };
};
