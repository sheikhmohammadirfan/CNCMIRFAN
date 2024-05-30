import { Box, Icon, Typography, makeStyles } from "@material-ui/core";
import { green, amber, red } from "@material-ui/core/colors";

export const useStyle = makeStyles(theme => ({

  // Root Register Container
  registerContainer: {
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
    "& [poam-id]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },

    // Increase z-index of header
    "& [header]": {
      zIndex: "3 !important",
      "&[poam-id]": { zIndex: "2 !important" },
    },

    // Add soting
    "& thead th:not(:first-child)": {
      "&::before, &::after": {
        position: "absolute",
        fontFamily: "Material Icons",
        right: 0,
        fontSize: 18,
        width: 10
      },
      "&::before": {
        content: "'\\2193'",
        color: theme.palette.grey[400],
        display: 'flex',
        top: 8,
        right: 3
      },
      "&::after": {
        content: "'\\2191'",
        color: theme.palette.grey[400],
        top: 8,
        right: 10
      },
      "&.asc::before": {
        content: "'\\2193'",
        color: '#4477CE'
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: '#4477CE'
      },
    },

    // Giving box shadow on left side to First cell on select
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: 'inset 4px 0 0 0 #4477CE',
    },

    // Change background color of selected row CELLS
    "& tr.Mui-selected td": {
      // background: "#8ef1f1 !important",
      background: "#e6f6f4 !important",
    },

    // Update sticky col background
    // "& thead th:nth-child(1)": { background: "#cce6e3" },
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    // "& tbody td:nth-child(1)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": { borderRight: `1px solid ${theme.palette.grey[300]}` },

    // searched data cell style
    "& tbody td[data-searched='true']": { border: "2px solid #4477CE" },
  },

  //Header cell style
  headerCell: {
    color: theme.palette.primary.main,
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: 'bold'
  },

  // Style to make all cell height of 3 line
  tableCell: {
    whiteSpace: "pre",
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

  treatmentAction: {
    fontSize: "0.8rem",
    padding: "0 0 0 5px"
  },

  treatmentStatus: {
    fontSize: "0.8rem",
    padding: "3px 7px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    "& *": {
      margin: "auto 0",
    },
  },

  riskScore: {
    padding: "5px",
    borderRadius: "5px",
    fontWeight: "600",
    height: "30px",
    width: "30px",
    // backgroundColor: red["200"],
    // backgroundColor: green["300"],
    // backgroundColor: amber["300"],
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center"
  },

  statusCell: {
    padding: "4px 8px",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    fontSize: "0.8rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  }
}))

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
export const RowCell = ({ text, column }) => {
  const classes = useStyle();
  // is the text an array ?
  let cellData = column === "Categories" || column === "CIA"
    ?
    <Box display="flex" gridColumnGap={5}>
      {text.map((element, elementIndex) => (
        <Typography key={elementIndex} variant="body1" noWrap className={classes.cellLabel}>{element}</Typography>
      ))}
    </Box>
    :
    (column === "Treatment")
      ?
      <Box display="flex" flexDirection="column" gridRowGap={5}>
        <Typography variant="body2" noWrap className={classes.treatmentAction}>
          {JSON.parse(text).treatmentAction}
        </Typography>
        <Typography variant="body2" noWrap className={classes.treatmentStatus}>
          {/* Displaying icon based on treatment status */}
          {JSON.parse(text).treatmentStatus === "Incomplete"
            ? <Icon style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "1rem", marginRight: "5px" }}>error</Icon>
            : <Icon style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "1rem", marginRight: "5px" }}>check_circle</Icon>
          }
          {JSON.parse(text).treatmentStatus}
        </Typography>
      </Box>
      :
      (column === "Inherent Risk" || column === "Residual Risk")
        ?
        <Typography
          variant="body2"
          noWrap
          className={classes.riskScore}
          style={{
            backgroundColor: text <= 9 ? "#81c784" : (text > 9 && text < 15 ? "#ffd54f" : "#e57373") 
          }}
          >
          {text}
        </Typography>
        :
        (column === "Status")
          ?
          <Typography variant="body2" noWrap className={classes.statusCell}>
            <span style={{
              minHeight: "10px",
              minWidth: "10px",
              borderRadius: "50%",
              display: "inline-block",
              backgroundColor: text === "Approved" ? "#4caf50" : "#ffd54f"
            }}>
            </span>
            {text}
          </Typography>
          :
          <Typography variant="body2" noWrap className={classes.tableCell}>
            {text}
          </Typography>
  // console.log(text);

  return cellData;
};

/* Method to map visible columns to header row */
export const mapDataToHeader = (visibleColumns, sorting, updateSort) => ({
  data: visibleColumns.map((text) => ({
    text,
    params:
      text === "POAM ID"
        ? {
          "poam-id": "",
          header: "",
          onClick: () => updateSort(text),
          className: sorting && sorting.column === text ? sorting.order : "",
        }
        : {
          onClick: () => updateSort(text),
          className: sorting && sorting.column === text ? sorting.order : "",
        },
  })),
  cellStyle: {
    fontWeight: "bold",
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
  },
});

/* Method to map a POA&M data to row dictionary */
const mapDataToRow = (data, columns, rowIndex, matchedCell) =>
  columns.map((columnName, index) => ({
    text: data[columnName][rowIndex],
    params:
      columnName === "Id"
        ? {
          "id": "",
          "data-searched": Boolean(
            matchedCell.find(
              (cell) =>
                cell.column === columnName &&
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
                cell.column === columnName &&
                cell.row === rowIndex &&
                cell.selected === true
            )
          ),
          tabIndex: 0,
          colName: columnName
        },
  }));


/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  columns,
  selectedList,
  matchedCell,
  sortingMap
) => {
  // count of number of rows
  const rowCount = Object.keys(data["Id"] || {}).length;
  // output 2D list
  const rowData = [];

  if (sortingMap) {
  }

  // Generate row of POA&M table
  for (let i = 0; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(
        data,
        columns,
        getRowIndex(data, i),
        matchedCell
      ),
      props: {
        selected: selectedList.indexOf(i) !== -1,
      },
    });

  return {
    rowData,
    rowStyle: { cursor: "pointer" },
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      position: "relative",
    },
  };
};

/* Method to get data row index from table index */
export const getRowIndex = (data, index, sortingMap) => {
  if (index === -1) return -1;
  if (sortingMap) return Object.keys(data["Id"])[sortingMap[index]];
  return Object.keys(data["Id"])[index];
};