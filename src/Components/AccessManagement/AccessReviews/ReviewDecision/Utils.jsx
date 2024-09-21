import { Box, Button, Icon, makeStyles, Typography } from "@material-ui/core";
import colorShader from "../../../Utils/ColorShader";
import { MultipePills } from "../../../Utils/DataTable/Cells";
import FlagCell from "./FlagCell";
import checkPermissionById from "../../../Utils/checkPermission";

export const useStyle = makeStyles((theme) => ({
  reviewDecisionContainer: {
    padding: theme.spacing(2),
  },
  todolistItem: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
    textTransform: 'none',
    '& p': {
      fontSize: '0.9rem'
    }
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

  addInRiskButton: {
    '&.Mui-disabled': {
      backgroundColor: `${colorShader(theme.palette.primary.main, 0.6)} !important`
    },
    '&.Mui-disabled img': {
      opacity: 0.4
    },
    maxHeight: 34,
    color: "#FFFFFF !important",
    paddingInline: 10,
    textTransform: 'none',
    transition: "color 0s"
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
        color: theme.palette.primary.main
      },
      "&.dsc::after": {
        content: "'\\2191'",
        color: theme.palette.primary.main
      },
    },

    // Giving box shadow on left side to First cell on select
    "& tr.Mui-selected td:nth-child(1)": {
      boxShadow: `inset 4px 0 0 0 ${theme.palette.primary.main}`,
    },

    // Change background color of selected row CELLS
    "& tr.Mui-selected td": {
      background: "#e2e7f0 !important",
    },

    // Update sticky col background
    "& thead th:nth-child(2)": { borderRight: `1px solid #d9d9d9` },
    "& tbody td:nth-child(2)": { borderRight: `1px solid ${theme.palette.grey[300]}` },

    // searched data cell style
    "& tbody td[data-searched='true']": { border: `2px solid ${theme.palette.primary.main}` },
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

  decisionButton: {
    fontSize: '0.875rem',
    textTransform: 'none',
  },

  approveBtnOutlineDisabled: {
    '&.Mui-disabled': {
      borderColor: `${colorShader('#098228', 0.6)} !important`,
      color: `${colorShader('#098228', 0.6)} !important`
    }
  },
  approveBtnContainedDisabled: {
    '&.Mui-disabled': {
      backgroundColor: `${colorShader('#098228', 0.4)} !important`
    }
  },

  denyBtnOutlineDisabled: {
    '&.Mui-disabled': {
      borderColor: `${colorShader('#C93C46', 0.6)} !important`,
      color: `${colorShader('#C93C46', 0.6)} !important`
    }
  },
  denyBtnContainedDisabled: {
    '&.Mui-disabled': {
      backgroundColor: `${colorShader('#C93C46', 0.4)} !important`
    }
  }

}))

export const mapDataToHeader = (columns, sorting, updateSort) => ({
  data: columns.map((text) => ({
    text,
    params:
      text === "Id"
        ? {
          "sticky": "",
          "header": "",
          // onClick: () => updateSort(text),
          // className: sorting ? (sorting.sort_order === 1 ? 'asc' : 'dsc') : "",
        }
        : {
          // onClick: () => updateSort(text),
          // className: sorting ? (sorting.sort_order === 1 ? 'asc' : 'dsc') : "",
        },
  })),
  cellStyle: {
    fontWeight: "bold",
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
  },
})

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

export const generateRows = (
  data,
  columns,
  handleFlagClick,
  changeDecision,
  decisionLoad,
  isReviewCompleted,
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
      data: mapDataToRow(
        data[i],
        i,
        columns,
        handleFlagClick,
        isReviewCompleted,
        changeDecision,
        decisionLoad,
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
}

const mapDataToRow = (row, rowIndex, columns, handleFlagClick, isReviewCompleted, changeDecision, decisionLoad, matchedCell) => (
  columns.map(colName => {
    // let CellComponent = colName in columnToCellMap && columnToCellMap[colName]
    let cellValue = getCellValue(row, colName, handleFlagClick, isReviewCompleted, changeDecision, decisionLoad);
    return {
      text: <RowCell text={cellValue} />,
      params:
        colName === "Id"
          ? {
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

const cellComponents = {
  role: MultipePills
}

const getCellValue = (row, colName, handleFlagClick, isReviewCompleted, changeDecision, decisionLoad) => {
  if (colName === 'flag') {
    return <FlagCell id={row['id']} flagged={row['flagged']} clickHandler={handleFlagClick} />
  }
  else if (colName === 'account_name') {
    return row['access'].account_name;
  }
  else if (colName === 'account_owner') {
    return row['access'].account_owner
  }
  else if (colName === 'role') {
    let cellValue = [{ text: row['access']['role'] }]
    return <cellComponents.role cellValue={cellValue} />
  }
  else if (colName === 'decision') {
    return <DecisionButtons row={row} reviewDone={isReviewCompleted} changeDecision={changeDecision} decisionLoad={decisionLoad} />
  }
  return row[colName]
}

function DecisionButtons({ row, reviewDone, changeDecision, decisionLoad }) {

  const requiredEditAccessListPerm = 11;
  const userHasEditAccessListPerm = checkPermissionById(requiredEditAccessListPerm)
  
  const classes = useStyle();
  const btnDisabled = reviewDone || decisionLoad || !userHasEditAccessListPerm

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gridColumnGap: '16px' }}>
      <Button
        size="small"
        className={`
          ${classes.decisionButton} 
          ${!row.approved ? classes.approveBtnOutlineDisabled : classes.approveBtnContainedDisabled}
        `}
        startIcon={<Icon>check</Icon>}
        variant={row.approved ? "contained" : "outlined"}
        style={{
          backgroundColor: row.approved ? "#098228" : "none",
          border: !row.approved ? '1px solid #098228' : 'none',
          color: row.approved ? "white" : '#098228',
        }}
        disabled={btnDisabled}
        onClick={() => !row.approved && changeDecision(row, true)}
      >
        Approve
      </Button>
      <Button
        size="small"
        className={`
          ${classes.decisionButton} 
          ${row.approved ? classes.denyBtnOutlineDisabled : classes.denyBtnContainedDisabled}
        `}
        startIcon={<Icon>block</Icon>}
        variant={!row.approved ? "contained" : "outlined"}
        style={{
          backgroundColor: !row.approved ? "#C93C46" : "none",
          border: row.approved ? '1px solid #C93C46' : 'none',
          color: !row.approved ? "white" : '#C93C46',
        }}
        disabled={btnDisabled}
        onClick={() => row.approved && changeDecision(row, false)}
      >
        Deny
      </Button>
      <Button
        size="small"
        className={classes.decisionButton}
        startIcon={<Icon style={{ color: "gold" }}>edit</Icon>}
        variant="outlined"
        disabled={reviewDone}
        onClick={() => changeDecision(row, 2)}
      >
        Change Roles
      </Button>
    </Box>
  )
}