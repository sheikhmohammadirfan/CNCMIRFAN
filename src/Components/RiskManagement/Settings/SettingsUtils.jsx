import columnToCellMap from "../../../assets/data/RiskManagement/TableColCellMap";
import { makeStyles, Typography } from "@material-ui/core";
import colorShader from "../../Utils/ColorShader";

export const useStyle = makeStyles(theme => ({
  // Radio buttons form control in prefences section
  radioControl: {
    width: "100%",
    borderRadius: "5px",
    "& .MuiFormLabel-root": {
      marginBottom: "10px",
    },
    "& .MuiRadio-root": {
      margin: "5px 10px",
      padding: 0,
      "&.Mui-checked": {
        color: theme.palette.primary.main
      }
    },
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      opacity: 0.8
    },
  },

  categoryChip: {
    backgroundColor: `${colorShader(theme.palette.primary.main, 0.1)} !important`,
    '&>.MuiChip-label': {
      color: `${theme.palette.primary.main}`,
    },
    '&.MuiButtonBase-root.MuiChip-root .MuiChip-deleteIcon': {
      color: `${colorShader(theme.palette.primary.main, 0.4)}`,
      '&:hover': {
        color: `${colorShader(theme.palette.primary.main, 0.75)}`
      }
    },
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

    "& [sticky][scenario=true]": {
      left: 200,
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
      background: "#e2e7f0 !important",
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
    color: "#797979",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: 'bold'
  },

  // Style to make all cell height of 3 line
  tableCell: {
    overflow: "hidden",
    userSelect: "none",
  },
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
export const RowCell = ({ text }) => {
  const classes = useStyle();
  return (
    <Typography variant="body2" className={classes.tableCell}>
      {text}
    </Typography>
  )
};

/* Method to map visible columns to header row */
export const mapDataToHeader = (visibleColumns, sorting, updateSort) => ({
  data: visibleColumns.map((text) => ({
    text,
    params:
      text === "Score" || text === "Range"
        ? {
          // "sticky": "",
          "scenario": text === "Scenario" ? "true" : "false",
          "header": "",
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

/* Method to map data to row dictionary */
const mapDataToRow = (row, rowIndex, columns, matchedCell, categories, owners, scores) => (
  columns.map(colName => {
    let CellComponent = colName in columnToCellMap && columnToCellMap[colName]
    let cellValue = getCellValue(row, colName, categories, owners, scores);
    return {
      text: colName in columnToCellMap ? <CellComponent cellValue={cellValue} /> : <RowCell text={cellValue} />,
      params:
        colName === "Score" || colName === "Range"
          ? {
            // "sticky": "",
            "scenario": colName === "Scenario" ? "true" : "false",
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
    }
  })
)

/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  columns,
  selectedList,
  matchedCell,
  sortingMap,
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
      data: mapDataToRow(
        data[i],
        i,
        columns,
        matchedCell,
      ),
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
      display: 'flex',
      alignItems: 'center',
      position: "relative",
    },
  };
};

const getCellValue = (row, colName, categories, owners, scores) => {
  if (colName === "Score") return row["score"];
  else if (colName === 'Label') return row['likelihood_name'] || row['impact_name']
  else if (colName === 'Description') return row['likelihood_description'] || row['impact_description']
  // if row is for score group
  else if (colName === "Range") return ({
    value: row['range_from'] + ' - ' + row['range_to'],
    color: row['color']
  })
  else if (colName === 'Group') return row['name'];
  else if (colName === 'Group Description') return row['description']
  else return row[colName]
}