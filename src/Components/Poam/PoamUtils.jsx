import { makeStyles, Typography } from "@material-ui/core";
import { copyObject } from "../Utils/Utils";

//! POA&M TABLE ----------------------------- STARTS

/* Generate POA&M table styles */
export const useStyle = makeStyles((theme) => ({
  // Root POA&M container
  poamContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
    padding: theme.spacing(1),
    "&.zoomed": { padding: theme.spacing(3) },
  },

  // Set table style
  tableStyle: {
    // Make row cell background white
    "& tbody td": { background: "#fafafa" },

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
      },
      "&::before": {
        content: "'\\e5c7'",
        top: 0,
      },
      "&::after": {
        content: "'\\e5c5'",
        top: 10,
      },
      "&.asc::before": {
        content: "''",
      },
      "&.dsc::after": {
        content: "''",
      },
    },

    // Change background color of selected row
    "& tr.Mui-selected td": { background: "#8ef1f1 !important" },

    // Update sticky col background
    "& thead th:nth-child(1)": { background: "#c0e6e2" },
    "& thead th:nth-child(2)": { background: "#c0e6e2" },
    "& tbody td:nth-child(1)": { background: "#e0f8f5" },
    "& tbody td:nth-child(2)": { background: "#e0f8f5" },
    "& tbody td[data-searched='true']": { border: "2px solid" },
  },

  //Header cell style
  headerCell: { fontWeight: "bold" },

  // Style to make all cell height of 3 line
  tableCell: {
    whiteSpace: "pre",
    overflow: "hidden",
    userSelect: "none",
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
    paddingTop: "4px",
    paddingBottom: "4px",
    cursor: "pointer",
  },
});

/* Method to map a POA&M data to row dictionary */
const mapDataToRow = (data, columns, rowIndex, matchedCell) =>
  columns.map((columnName, index) => ({
    text: data[columnName][rowIndex],
    params:
      columnName === "POAM ID"
        ? {
            "poam-id": "",
            "data-searched": Boolean(
              matchedCell.find(
                (cell) =>
                  cell.column === columnName &&
                  cell.row == rowIndex &&
                  cell.selected === true
              )
            ),
            tabindex: 0,
          }
        : {
            "data-searched": Boolean(
              matchedCell.find(
                (cell) =>
                  cell.column === columnName &&
                  cell.row == rowIndex &&
                  cell.selected === true
              )
            ),
            tabindex: 0,
          },
  }));

/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  isOpen,
  columns,
  selectedList,
  secondaryOpen,
  setSecondaryOpen,
  matchedCell,
  sortingMap
) => {
  // count of number of rows
  const rowCount = Object.keys(data["POAM ID"] || {}).length;
  // output 2D list
  const rowData = [];
  // Set initial offset for open sheet
  const offset = isOpen ? 2 : 0;

  if (sortingMap) {
  }

  // Generate row of POA&M table
  for (let i = offset; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(
        data,
        columns,
        getRowIndex(data, i, sortingMap),
        matchedCell
      ),
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

//! POA&M TABLE ----------------------------- END

//! POA&M UTILITY --------------------------- START

/* Method to get data row index from table index */
export const getRowIndex = (data, index, sortingMap) => {
  if (index === -1) return -1;
  if (sortingMap) return Object.keys(data["POAM ID"])[sortingMap[index]];
  return Object.keys(data["POAM ID"])[index];
};

/* Method to upload visible columns based on secondary columns */
export const updateColumns = (allColumns, secondaryColumns) =>
  allColumns.filter((columnName) => !secondaryColumns.includes(columnName));

/* Method to put issue in the current POA&M sheet */
export const putIssueInData = (setter, getSheet, index, issueID) => {
  if (index !== -1)
    setter((prevData) => {
      const temp = copyObject(prevData);
      getSheet(temp).jira_issues[index][issueID] = true;
      return temp;
    });
};

/* Method to update row with new data in given POA&M data */
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

/* Method to get current max POA&M id & POA&M id prefix */
export function getPoamID_data(data) {
  if (!data) return { prefix: "", maxValue: "" };

  // Map sheet data to list of POA&M ID
  const mapPOAM = (val) =>
    Object.values(val)
      .slice(2)
      .map((x) => Number(x.substring(2)));
  const openIDList = mapPOAM(data.open["POAM ID"]);
  const closeIDList = mapPOAM(data.close["POAM ID"]);

  // max exsisting POA&M ID
  let maxValue = Math.max(...openIDList, ...closeIDList);
  maxValue = maxValue < 0 ? 0 : maxValue;

  // prefix for POA&M ID
  const prefix =
    Object.values(
      data[openIDList.length ? "open" : "close"]["POAM ID"]
    )[2]?.split("-")[0] || "V";

  return { prefix, maxValue };
}

/* Method to validate POA&M id */
export function validateID(val, prefix, maxValue) {
  let l = val.split("-");
  if (l.length !== 2) return "POA&M ID should be in V-XX format";
  if (l[0] !== prefix) return `POA&M ID should have prefix ${prefix}-`;
  if (isNaN(l[1])) return "POA&M ID should be a number.";
  if (Number(l[1]) <= maxValue)
    return `POA&M ID should be atleast ${maxValue + 1}`;
  return true;
}

export function getSortingMap(data, isOpen, sorting) {
  if (!sorting) return null;

  const offset = isOpen ? 2 : 0;
  const colDataArray = [];
  // const rowCount = Object.keys(data["POAM ID"]).length;

  const values = Object.values(data[sorting.column]).slice(offset);
  for (let i = 0; i < values.length; i++) {
    colDataArray.push({ index: i + offset, value: values[i] });
  }
  colDataArray.sort((a, b) => {
    if (a.value > b.value) {
      return sorting.order === "asc" ? 1 : -1;
    }
    if (a.value < b.value) {
      return sorting.order === "asc" ? -1 : 1;
    }
    return 0;
  });

  const map = {};
  for (let i = 0; i < colDataArray.length; i++) {
    map[colDataArray[i].index] = i + offset;
  }
  return map;
}

//! POAM UTILITY --------------------------- END
