import { makeStyles, Typography } from "@material-ui/core";
import { copyObject } from "../Utils/Utils";

//! POAM TABLE ----------------------------- STARTS

/* Generate poam table styles */
export const useStyle = makeStyles((theme) => ({
  // Root poam container
  poamContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
    padding: theme.spacing(1),
    "&.zoomed": { padding: theme.spacing(3) },
  },

  // Set table style
  tableStyle: {
    // Make row cell background white
    "& tbody td": { background: "#fafafa !important" },

    // Stick All checkbox in table to be sticky left
    "& [checkbox]": { position: "sticky !important", left: 0, zIndex: 2 },

    // Make poam ID column to sticky left with offset of 50px
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

    // Change background color of selected row
    "& tr.Mui-selected td": { background: "#d4e9e9 !important" },
  },

  //Header cell style
  headerCell: { fontWeight: "bold" },

  // Style to make all cell height of 3 line
  tableCell: {
    whiteSpace: "pre-line",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "3",
    overflow: "hidden",
  },

  // Style for table container
  gridContainer: {
    "& > div": { maxHeight: "75vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
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
      {text}
    </Typography>
  );
};

/* Method to map visible columns to header row */
export const mapDataToHeader = (visibleColumns) => ({
  data: visibleColumns.map((text) => ({
    text,
    params: text === "POAM ID" ? { "poam-id": "", header: "" } : {},
  })),
  cellStyle: {
    fontWeight: "bold",
    paddingTop: "4px",
    paddingBottom: "4px",
  },
});

/* Method to map a poam data to row dictionary */
const mapDataToRow = (data, columns, rowIndex) =>
  columns.map((columnName, index) => ({
    text: data[columnName][rowIndex],
    params: columnName === "POAM ID" ? { "poam-id": "" } : {},
  }));

/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  isOpen,
  columns,
  selectedList,
  secondaryOpen,
  setSecondaryOpen
) => {
  // count of number of rows
  const rowCount = Object.keys(data["POAM ID"] || {}).length;
  // output 2D list
  const rowData = [];
  // Set initial offset for open sheet
  const offset = isOpen ? 2 : 0;

  // Generate row of poam table
  for (let i = offset; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(data, columns, getRowIndex(data, i)),
      props: {
        selected:
          selectedList.indexOf(i - offset) !== -1 || secondaryOpen === i,
        onClick: () => setSecondaryOpen(i),
      },
    });

  return {
    rowData,
    rowStyle: { cursor: "pointer" },
    cellStyle: {
      paddingTop: "6px",
      paddingBottom: "4px",
      verticalAlign: "top",
      position: "relative",
    },
  };
};

//! POAM TABLE ----------------------------- END

//! POAM UTILITY --------------------------- START

/* Method to get data row index from table index */
export const getRowIndex = (data, index) =>
  index === -1 ? -1 : Object.keys(data["POAM ID"])[index];

/* Method to upload visible columns based on secondary columns */
export const updateColumns = (allColumns, secondaryColumns) =>
  allColumns.filter((columnName) => !secondaryColumns.includes(columnName));

/* Method to put issue in the current poam sheet */
export const putIssueInData = (setter, getSheet, index, issueID) => {
  if (index !== -1)
    setter((prevData) => {
      const temp = copyObject(prevData);
      getSheet(temp).jira_issues[index][issueID] = true;
      return temp;
    });
};

/* Method to update row with new data in given poam data */
export const updatePoamRow = (setter, getSheet, newData, index) => {
  const columns = Object.keys(newData);
  setter((prevData) => {
    const temp = copyObject(prevData);
    for (let columnName of columns)
      getSheet(temp)[columnName][index] = newData[columnName][index];
    return temp;
  });
};

/* Method to move row between sheet */
export const movePoamRow = (setter, isOpen, data, fromIndex, toIndex) => {
  const labels = Object.keys(data);
  setter((prevData) => {
    // Initialize obj
    const temp = copyObject(prevData);
    const fromSheet = temp[isOpen ? "open" : "close"];
    const toSheet = temp[!isOpen ? "open" : "close"];
    // put new data to toSheet & remove from fromSheet
    for (let columnsName of labels) {
      toSheet[columnsName][toIndex] = data[columnsName];
      delete fromSheet[columnsName][fromIndex];
    }
    return temp;
  });
};

/* Method to extract data of specified row */
export function getRowData(data, index) {
  const temp = {};
  const labels = Object.keys(data);
  for (var columnName of labels) temp[columnName] = data[columnName][index];
  return temp;
}

/* Method to get last/max id of passed data */
export function getLastIndex(data) {
  // Target a Column
  const col = data["POAM ID"];
  // Get exsisting id list
  const ids = Object.keys(col || {});

  // If there is no data, then return 0
  if (ids.length === 0) return 0;

  // Find MAX id
  const max = Math.max(...ids);
  return max;
}

/* Method to get current max poam id & poam id prefix */
export function getPoamID_data(data) {
  if (!data) return { prefix: "", maxValue: "" };

  // Map sheet data to list of POAM ID
  const mapPOAM = (val) =>
    Object.values(val)
      .slice(2)
      .map((x) => Number(x.substring(2)));
  const openIDList = mapPOAM(data.open["POAM ID"]);
  const closeIDList = mapPOAM(data.close["POAM ID"]);

  // max exsisting POAM ID
  let maxValue = Math.max(...openIDList, ...closeIDList);
  maxValue = maxValue < 0 ? 0 : maxValue;

  // prefix for POAM ID
  const prefix =
    Object.values(
      data[openIDList.length ? "open" : "close"]["POAM ID"]
    )[2]?.split("-")[0] || "V";

  return { prefix, maxValue };
}

/* Method to validate poam id */
export function validateID(val, prefix, maxValue) {
  let l = val.split("-");
  if (l.length !== 2) return "POAM ID should be in V-XX format";
  if (l[0] !== prefix) return `POAM ID should have prefix ${prefix}-`;
  if (isNaN(l[1])) return "POAM ID should be a number.";
  if (Number(l[1]) <= maxValue)
    return `POAM ID should be atleast ${maxValue + 1}`;
  return true;
}

//! POAM UTILITY --------------------------- END
