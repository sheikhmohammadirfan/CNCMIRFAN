import { Typography, makeStyles } from "@material-ui/core";
import columnToCellMap from "../../../assets/data/RiskManagement/TableColCellMap";
import {
  HEADER_TABLE_COLS_MAP,
  HEADER_TABLE_FILTERS_MAP,
} from "../../../assets/data/RiskManagement/RiskRegister/RiskRegisterColumns";
import colorShader from "../../Utils/ColorShader";

export const useStyle = makeStyles((theme) => ({
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
    "& [sticky]": {
      position: "sticky !important",
      left: 50,
      zIndex: 1,
    },

    "& [sticky][riskid=true]": {
      left: 100,
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

  treatmentAction: {
    fontSize: "0.8rem",
    padding: "0 0 0 5px",
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
    textAlign: "center",
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

  // Risk Create/Edit form Container
  formContainer: {
    "& .MuiDialogContent-root": {
      padding: "24px",
    },
  },

  // REGISTER FORM STYLES

  // Mui autocomplete styles
  customAutocomplete: {
    "& .MuiAutocomplete-input": {
      // to bring autocomplete input's label in center. it was off by some pixels
      paddingTop: "10px !important",
    },
  },

  // Accordion styles
  customAccordion: {
    border: "1px solid rgba(0, 0, 0, 0.25)",
    "&.Mui-expanded": {
      // borderWidth: 2,
      // borderColor: theme.palette.primary.main,
      // borderColor: "rgba(0, 0, 0, 0.4)"
    },
    "& .MuiAccordionSummary-content": {
      margin: "16px 0",
    },
    "& .MuiAccordionSummary-content.Mui-expanded": {
      margin: "16px 0",
    },
  },

  // Sub inputs container (container which contains 2 or more inputs)
  subInputsContainer: {
    border: "1px solid #c5c5c5",
    borderRadius: "4px",
    "&.error": {
      borderColor: theme.palette.error.main,
    },
  },

  // subtitle in inputs
  inputSubtitle: {
    color: "rgba(0, 0, 0, 0.8)",
    padding: "16px",
    fontSize: "1rem",
  },

  // Cia categories label for checkboxes
  ciaLabel: {
    "& .MuiFormControlLabel-label": {
      color: "rgba(0, 0, 0, 0.8)",
      fontSize: "0.9rem",
    },
  },

  // CIA Checkboxes in risk create and edit form
  ciaCheckbox: {
    color: "rgba(0, 0, 0, 0.3)",
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
    "&.Mui-checked.Mui-disabled": {
      color: colorShader("000000", 0.4),
    },
  },

  // Risk Sliders Container
  riskSliderContainer: {
    padding: "16px",
  },

  // Container for treatment inputs
  treatmentInputContainer: {
    padding: "0 16px 0",
  },

  subInputSubtitle: {
    // fontSize: "0.8rem",
    color: "rgba(0, 0, 0, 0.6)",
    margin: "0 0 10px 5px",
    "&:nth-of-type(2)": {
      marginTop: "10px",
    },
  },

  errorText: {
    color: theme.palette.error.main,
    padding: "3px 14px 0 9px",
    display: "inline-block",
  },

  // Risk scoring slider container
  sliderContainer: {
    width: "100%",
    padding: "20px",
    // backgroundColor: "rgba(68, 119, 206, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: "5px",
  },

  // Custom slider
  customSlider: {
    // marginRight: "auto",
    color: theme.palette.primary.main,
    "& .MuiSlider-rail": {
      height: "4px",
      opacity: 0.15,
    },
    "& .MuiSlider-track": {
      height: "4px",
    },
    "& .MuiSlider-thumb": {
      marginTop: "-4px",
      width: "12px",
      height: "12px",
      // borderRadius: "0",
    },
    "& .MuiSlider-mark": {
      opacity: 0.15,
    },
    "& .MuiSlider-markActive": {
      backgroundColor: theme.palette.primary.main,
    },
  },

  noValue: {
    "& .MuiSlider-thumb": {
      opacity: 0,
    },
    "& .MuiSlider-markLabelActive": {
      color: theme.palette.grey[600],
    },
    "& .description": {
      opacity: 0,
      pointerEvents: "none",
    },
  },

  // Horizontal divider after slider
  sliderDivider: {
    // backgroundColor: theme.palette.primary.main
  },

  // slider value's title
  sliderValueTitle: {
    display: "flex",
    gap: "0 5px",
  },

  // Label of title. Eg 1,2,3 etc
  sliderTitleLabel: {
    display: "flex",
    gap: "0 5px",
    "& span:nth-child(2)": {
      color: "rgba(68, 119, 206, 0.8)",
      margin: "auto 0",
    },
    justifyContent: "center",
    "& .MuiIcon-root": {
      fontSize: "1rem",
    },
  },

  // Tooltip for slider description
  sliderDescTooltip: {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.8rem",
    padding: "10px",
  },

  // description of value selected in slider
  sliderValueDesc: {
    marginTop: "10px",
    color: "#808080",
  },

  // Radio Button title
  labelTitle: {
    fontSize: "0.9rem",
  },

  // Radio Button Caption
  labelCaption: {
    fontSize: "0.8rem",
  },

  // Radio buttons form control in register form
  radioControl: {
    // backgroundColor: "rgba(68, 119, 206, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    width: "100%",
    padding: "20px 10px 10px",
    borderRadius: "5px",
    "& .MuiFormLabel-root": {
      marginBottom: "10px",
    },
    "& .MuiRadio-root": {
      margin: "15px 10px 15px 10px",
      padding: 0,
      "&.Mui-checked": {
        color: theme.palette.primary.main,
      },
    },
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

  actionContainer: {
    "& button": {
      display: "block",
      background: "transparent",
      border: "none",
      fontSize: "inherit",
      color: theme.palette.primary.dark,
      cursor: "pointer",
      textAlign: "start",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      "&:hover": {
        color: theme.palette.primary.light,
        textDecoration: "underline",
      },
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
    <Typography variant="body2" className={classes.tableCell}>
      {text}
    </Typography>
  );
};

const COLUMN_FILTER_MAP = {
  Scenario: ["text"],
  Source: ["filter"],
  Categories: ["text", "filter"],
  Owner: ["text", "filter"],
  "Identified Date": ["filter"],
  CIA: ["filter"],
  "Inherent Risk": ["filter"],
  "Residual Risk": ["filter"],
  Treatment: ["filter"],
  Approved: ["filter"],
};

/* Method to map visible columns to header row */
export const mapDataToHeader = (visibleColumns, sorting, updateSort) => ({
  data: visibleColumns.map((text) => ({
    text,
    params: {
      onClick: () => updateSort(text),
      className:
        sorting && sorting.sort_by === HEADER_TABLE_COLS_MAP[text]
          ? sorting.sort_order === 1
            ? "asc"
            : "dsc"
          : "",
    },
    colName: HEADER_TABLE_FILTERS_MAP[text],
    filterType: COLUMN_FILTER_MAP[text] || [],
    filterCellCss: {},
  })),
  cellStyle: {
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
});

/* Method to map data to row dictionary */
const mapDataToRow = (
  row,
  rowIndex,
  columns,
  matchedCell,
  categories,
  owners,
  scores
) =>
  columns.map((colName) => {
    let CellComponent = colName in columnToCellMap && columnToCellMap[colName];
    let cellValue = getCellValue(row, colName, categories, owners, scores);
    return {
      text:
        colName in columnToCellMap ? (
          <CellComponent cellValue={cellValue} />
        ) : (
          <RowCell text={cellValue} />
        ),
      params: {
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

/* Method to convert 2D row data into table body format */
export const generateRows = (
  data,
  columns,
  selectedList,
  matchedCell,
  categories,
  owners,
  scores,
  sortingMap
) => {
  // count of number of rows
  const rowCount = data.length;
  // output 2D list
  const rowData = [];

  if (sortingMap) {
  }

  // Generate row of register table
  for (let i = 0; i < rowCount; i++)
    rowData.push({
      data: mapDataToRow(
        data[i],
        i,
        columns,
        matchedCell,
        categories,
        owners,
        scores
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
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
  };
};

const getCellValue = (row, colName, categories, owners, scores) => {
  if (colName === "Scenario") {
    return JSON.parse(row["Scenario"]).description;
  } else if (colName === "Source") {
    let sourceType = JSON.parse(row["Scenario"]).source_type;
    return sourceType === 0 ? "SYSTEM" : "CUSTOM";
  } else if (colName === "Categories") {
    let catsId = JSON.parse(row["Scenario"]).categories_id;
    return categories.filter((cat, id) => catsId.includes(cat.id));
  } else if (colName === "Owner") {
    let owner = owners.find((owner) => owner.id === row["Owner"]);
    return `${owner?.first_name} ${owner?.last_name}` || "";
  } else if (colName === "Inherent Risk") {
    const val =
      scores?.likelihoodScores.find(
        (score) => score?.id === row["Inherent Risk Likelihood Id"]
      ).score *
      scores?.impactScores.find(
        (score) => score?.id === row["Inherent Risk Impact Id"]
      )?.score;
    const group = scores?.riskScoreGroups.find(
      (r) => r.range_from <= val && val <= r.range_to
    );
    return { value: val, colour: group.color };
  } else if (colName === "Residual Risk") {
    const val =
      (scores?.likelihoodScores.find(
        (score) => score?.id === row["Residual Risk Likelihood Id"]
      )?.score || 0) *
      (scores.impactScores.find(
        (score) => score?.id === row["Residual Risk Impact Id"]
      )?.score || 0);

    const group = Boolean(val)
      ? scores.riskScoreGroups.find(
          (r) => r.range_from <= val && val <= r.range_to
        )
      : { color: null };

    return { value: val, colour: group.color };
  } else return row[colName];
};

/* Method to get data row index from table index */
export const getRowIndex = (data, index, sortingMap) => {
  if (index === -1) return -1;
  if (sortingMap) return Object.keys(data["Id"])[sortingMap[index]];
  return Object.keys(data["Id"])[index];
};
