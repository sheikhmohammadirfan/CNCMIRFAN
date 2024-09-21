import { makeStyles } from "@material-ui/core";
import colorShader from "../../Utils/ColorShader";
import { Typography } from "@mui/material";
import columnCellMap from "./cellMap";
import { SORT_NAME_MAP } from "../../../assets/data/Rbac/Organization/columns";

export const useStyle = makeStyles(theme => ({
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tableFilterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    border: '1px solid',
    borderColor: '#d9d9d9',
    borderBottom: 'none'
  },

  filterDropdownsContainer: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 8,
  },

  // Style for table container
  gridContainer: {
    "& > div": { maxHeight: "75vh" },
    "&.zoomed > div": { maxHeight: "83vh" },
  },

  searchInput: {
    width: 300,
    '@media (max-width: 960px)': {
      flexGrow: 1,
    },
    backgroundColor: 'white',
    borderRadius: 7,
    borderRight: 0,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      height: 35
    },
    // overflow: "hidden"
  },

  headerBtn: {
    '&.MuiButtonBase-root.MuiButton-root': {
      textTransform: 'none'
    },
    height: 34,
  },

  whiteBtn: {
    '&.MuiButtonBase-root.MuiButton-root': {
      '&.Mui-disabled': {
        color: `${colorShader('#4477CE', 0.5)} !important`
      },
      '&.Mui-disabled img': {
        opacity: 0.4
      },
      backgroundColor: 'white',
      color: theme.palette.primary.main,
      border: '1px solid rgba(0, 0, 0, 0.2)',
      paddingInline: 10,
      textTransform: 'none',
    }
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
        width: 10
      },
      "&:not(.hide-sort)::before": {
        content: "'\\2193'",
        color: theme.palette.grey[400],
        display: 'flex',
        top: 8,
        right: 3
      },
      "&:not(.hide-sort)::after": {
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
    '&.MuiTypography-root': {
      color: "#797979",
      fontSize: 12,
      textTransform: "uppercase",
      fontWeight: 'bold'
    }
  },

  // Style to make all cell height of 3 line
  tableCell: {
    overflow: "hidden",
    userSelect: "none",
  },

  // Risk Create/Edit form Container
  formContainer: {
    "& .MuiDialogContent-root": {
      padding: "24px"
    }
  },

  inviteDialog: {
    '& .MuiPaper-root': {
      minWidth: '600px'
    }
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

export const mapDataToHeader = (columns, sorting, updateSort) => ({
  data: columns.map((text) => ({
    text,
    params: {
      onClick: () => COLS_SORTABLE.includes(text) && updateSort(text),
      className: sorting && sorting.sort_by === SORT_NAME_MAP[text]
        ? (sorting.sort_order === 1 ? 'asc' : 'dsc')
        : (COLS_SORTABLE.includes(text)) ? "" : "hide-sort",
    },
  })),
  cellStyle: {
    fontWeight: "bold",
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
  },
})

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
      data: mapDataToRow(
        data[i],
        i,
        columns,
        matchedCell,
        categories,
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
}

const mapDataToRow = (row, rowIndex, columns, matchedCell) => (
  columns.map(colName => {
    let CellComponent = colName in columnCellMap && columnCellMap[colName]
    let cellValue = getCellValue(row, colName);
    return {
      text: colName in columnCellMap ?
        <CellComponent
          cellValue={cellValue}
          {...colName === 'status' && {
            showColorDot: true,
            dotColor: STATUS_MAP[row.admin[0].status].dotColor
          }}
        /> :
        <RowCell text={cellValue} />,
      params: colName === "Id" ? {
        "sticky": "",
        "data-searched": Boolean(
          matchedCell.find(
            (cell) =>
              cell.column === colName &&
              cell.row === rowIndex &&
              cell.selected === true
          )
        ),
        tabIndex: 0,
      } : {
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

const getCellValue = (row, colName) => {
  if (colName === 'name') return row[colName]
  if (colName === 'first_name') return row?.admin[0].first_name
  if (colName === 'last_name') return row?.admin[0].last_name
  if (colName === 'email') return row?.admin[0].email
  if (colName === 'status') return STATUS_MAP[row.admin[0].status].text
  return row[colName]
}

const COLS_SORTABLE = ['Name', 'First Name', 'Admin First Name', 'Admin Last Name', 'Admin Email']

const STATUS_MAP = {
  0: {
    text: "Inactive",
    dotColor: "red"
  },
  1: {
    text: "Active",
    dotColor: "#4caf50"
  },
  2: {
    text: "Invited",
    dotColor: "#ffd54f"
  }
}