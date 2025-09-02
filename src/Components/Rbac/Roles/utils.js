import { makeStyles } from "@material-ui/core";
import { Typography } from "@mui/material";
import { HEADER_NAME_MAP } from "../../../assets/data/Rbac/Users/columns";
import columnCellMap from "./cellMap";
import colorShader from "../../Utils/ColorShader";

export const useStyle = makeStyles(theme => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    border: '1px solid',
    borderColor: '#d9d9d9',
    borderBottom: 'none'
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
      // height: 35
    },
    // overflow: "hidden"
  },

  headerBtn: {
    '&.MuiButtonBase-root.MuiButton-root': {
      textTransform: 'none'
    }
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
      // "&::before": {
      //   content: "'\\2193'",
      //   color: theme.palette.grey[400],
      //   display: 'flex',
      //   top: 8,
      //   right: 3
      // },
      // "&::after": {
      //   content: "'\\2191'",
      //   color: theme.palette.grey[400],
      //   top: 8,
      //   right: 10
      // },
      // "&.asc::before": {
      //   content: "'\\2193'",
      //   color: '#4477CE'
      // },
      // "&.dsc::after": {
      //   content: "'\\2191'",
      //   color: '#4477CE'
      // },
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
    '& .MuiPaper-root': {
      maxWidth: 'none',
      width: '800px'
    },
    "& .MuiDialogContent-root": {
      padding: "24px",
    }
  },

  permissionLabel: {
    "& .MuiFormControlLabel-label": {
      color: "rgba(0, 0, 0, 0.8)",
      fontSize: "0.9rem",
    },
    '& svg': {
      fontSize: '1.3rem'
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
  data: columns.map((col) => ({
    text: col.name,
    params: {
      onClick: true ? () => { } : () => updateSort(col.name),
      className: sorting && sorting.sort_by === HEADER_NAME_MAP[col.name] ? (sorting.sort_order === 1 ? 'asc' : 'dsc') : "",
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
    let cellValue = colName.id === 0 ? row['name'] : Boolean(row.permissions.find(p => p.id === colName.id))
    return {
      text: colName.id !== 0 ? <columnCellMap.permission flag={cellValue} /> : <RowCell text={cellValue} />,
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
  return row[colName]
}