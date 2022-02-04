import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  columns_width,
  hidden_columns,
  poam_header,
  secondary_columns,
} from "../assets/data/PoamData";
import DocumentTitle from "../Components/DocumentTitle";
import FormDialog from "../Components/Poam/FormDialog";
import JustificationDialog from "../Components/Poam/JustificationDialog";
import PoamHeader from "../Components/Poam/PoamHeader";
import SecondaryTable from "../Components/Poam/SecondaryTable";
import UploadPoam from "../Components/Poam/UploadPoam";
import DataTable from "../Components/Utils/DataTable/DataTable";
import SkeletonBox from "../Components/Utils/SkeletonBox";
import {
  addRow,
  getData,
  getLastIndex,
  getRowData,
  moveToClose,
  moveToOpen,
  updatePoam,
  updateRow,
} from "../Service/Poam.service";
import useParams from "../Components/Utils/Hooks/useParams";

/* Generate css style */
const useStyle = makeStyles((theme) => ({
  // Root poam container
  poamContainer: {
    maxHeight: `calc(100vh - ${theme.headerHeight}px)`,
    overflow: "hidden",
    padding: theme.spacing(1),
    "&.zoomed": { padding: theme.spacing(3) },
  },

  //Header cell style
  headerCell: { fontWeight: "bold" },

  // Set table style
  tableStyle: {
    // Make row cell background white
    "& tbody td": { background: "#fafafa !important" },

    // Stick rows checkbox & left fo table
    "& td:nth-child(1)": {
      position: "sticky !important",
      left: "0 !important",
      zIndex: "1 !important",
    },

    // Stick header checkbox & left fo table
    "& th:nth-child(1)": {
      left: "0 !important",
      zIndex: "2 !important",
    },

    // Change background color of selected row
    "& tr.Mui-selected td": { background: "#d4e9e9 !important" },
  },

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

/* POAM PAGE COMPONENT */
export default function Poam({ title }) {
  const classes = useStyle();

  // Fullscreen handler to zoom in and zoom out
  const fullScreenHandler = useFullScreenHandle();
  const zoomIn = fullScreenHandler.enter;
  const zoomOut = fullScreenHandler.exit;
  const isZoomed = () => fullScreenHandler.active;

  // Custom hook to handle Query params
  const { params, changeParams, deleteParams } = useParams(
    "sheet",
    "issueId",
    "file"
  );
  // Get sheet status
  const isOpenPoam = () => params.sheet !== "close";
  // Change status of poam
  const showOpenPoam = () => changeParams({ sheet: "open" });
  const showClosePoam = () => changeParams({ sheet: "close" });

  // React state to maintain loading status
  const [isDataLoading, setIsDataLoading] = useState(false);
  const startLoading = () => setIsDataLoading(true);
  const stopLoading = () => setIsDataLoading(false);

  // React state to maintain justify dailog status
  const [justifyOpen, setJustifyOpen] = useState(false);
  const openJustify = () => setJustifyOpen(true);
  const closeJustify = () => setJustifyOpen(false);

  // hook to store selected rows
  const [selectedRow, setSelectedRow] = useState([]);
  const getCurrentRow = () =>
    selectedRow.length > 0 ? selectedRow[0] + (isOpenPoam() ? 2 : 0) : -1;

  // hook to store index of data to be shown in secondary tabel
  const [secondaryOpen, setSecondaryOpen] = useState(-1);

  // State to managing dailog visibility
  const [formOpen, setFormOpen] = useState(false);
  const editRowData = () => setFormOpen(true);
  const addNewRow = () => {
    setSelectedRow([]);
    setFormOpen(true);
  };
  const closeFormDialog = () => setFormOpen(false);

  // State to save table data & name
  const [poamData, setPoamData] = useState();
  const [poamName, setPoamName] = useState();

  // List for all types of columns
  const [allColumns, setAllColumns] = useState(poam_header);
  const [hiddenColumns, sethiddenColumns] = useState(hidden_columns);
  const [secondaryColumns, setSecondaryColumns] = useState(secondary_columns);
  const [visibleColumns, setVisibleColumns] = useState();

  // Update visible cols on secondary column change
  useEffect(
    () =>
      setVisibleColumns(
        allColumns.filter(
          (columnName) => !secondaryColumns.includes(columnName)
        )
      ),
    [allColumns, secondaryColumns]
  );

  // Method to move columns to secondary table
  const moveToSecondary = (colName) =>
    setSecondaryColumns((prevCol) => [...prevCol, colName]);
  // Method to remove columns from secondary table
  const moveToPrimary = (colName) =>
    setSecondaryColumns((prevCol) => prevCol.filter((c) => c !== colName));

  // Fetch data
  const fetchData = async () => {
    startLoading();
    const { data, status } = await getData(isOpenPoam(), params.file);
    if (!status) return stopLoading();
    setPoamData(data.data);
    setPoamName(data.file_name);
    stopLoading();
  };

  // Reset Current_Row, Selected_Row & update Query_Params state on route change
  useEffect(() => {
    if (params.file) {
      setSelectedRow([]);
      fetchData();
      // if param contain rowIndex & issueId, then delete them
      if (params.rowIndex || params.issueId)
        deleteParams("rowIndex", "issueId");
    }
  }, [params]);

  // Method to get row index from lis index
  const getRowIndex = (lstIndex) =>
    lstIndex === -1 ? -1 : Object.keys(poamData["POAM ID"])[lstIndex];

  // Header cell component
  const HeaderCell = ({ text }) => (
    <Typography noWrap variant="body1" className={classes.headerCell}>
      {text}
    </Typography>
  );

  // Row cell component
  const RowCell = ({ text }) => (
    <Typography variant="body2" noWrap className={classes.tableCell}>
      {text}
    </Typography>
  );

  // Method to map header data to table header
  const mapDataToHeader = () => ({
    data: visibleColumns.map((txt, index) => ({
      text: <HeaderCell text={txt} />,
      css: index === 0 ? { left: 50, zIndex: 2 } : {},
    })),
    cellStyle: {
      fontWeight: "bold",
      paddingTop: "4px",
      paddingBottom: "4px",
    },
  });

  // Convert data to row cell
  const mapDataToRow = (lstIndex) =>
    visibleColumns.map((headerName, index) => ({
      text: <RowCell text={poamData[headerName][getRowIndex(lstIndex)]} />,
      css:
        index === 0
          ? {
              left: 50,
              position: "sticky",
              zIndex: 1,
              background: "#fafafa",
            }
          : {},
    }));

  // Combine rows
  const rows = () => {
    const rowData = [];
    const rowCount = Object.keys(poamData["POAM ID"]).length;
    const startIndex = isOpenPoam() ? 2 : 0;

    for (let i = startIndex; i < rowCount; i++)
      rowData.push({
        data: mapDataToRow(i),
        props: {
          selected:
            selectedRow.indexOf(i - startIndex) !== -1 || secondaryOpen === i,
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

  // Method to create new row
  const createNewRow = async (newData) => {
    let newIndex = getLastIndex(poamData) + 1;
    const { data, status } = await addRow(newIndex, newData);

    if (status)
      setPoamData((prevData) =>
        updatePoam(prevData, data, allColumns, newIndex)
      );
  };

  // Method to edit existing row
  const updateRowData = async (newData) => {
    const rowIndex = getRowIndex(getCurrentRow());
    const { data, status } = await updateRow(rowIndex, newData);

    if (status)
      setPoamData((prevData) =>
        updatePoam(prevData, data, allColumns, rowIndex)
      );
  };

  // Method to move row to & from OPEN & CLOSE
  const moveRow = async (justification) => {
    // Get data
    const rowIndex = getRowIndex(getCurrentRow());
    const rowData = getRowData(rowIndex, allColumns, poamData);

    // Add justification
    rowData.justification = justification;

    // Make api call
    const { data, status } = await (isOpenPoam()
      ? moveToClose(rowIndex, rowData, params.file)
      : moveToOpen(rowIndex, rowData, params.file));

    // reset data
    if (status) {
      setPoamData(data);
      setSelectedRow([]);
    }
  };

  // Method to set rowindex in param and show createIssue dialog
  const showCreateIssue = () => {
    changeParams({ rowIndex: getRowIndex(getCurrentRow()), createIssue: true });
  };

  // Method to set issue details in param and show updateIssue dialog
  const showUpdateIssue = () => {
    const rowIndex = getRowIndex(getCurrentRow());
    changeParams({
      issues: JSON.stringify(poamData["jira_issues"][rowIndex]),
      updateIssue: true,
    });
  };

  // Method to check if row contains any issue
  const containIssue = () => {
    const rowIndex = getRowIndex(getCurrentRow());
    return (
      rowIndex !== -1 &&
      Object.keys(poamData["jira_issues"][rowIndex]).length > 0
    );
  };

  DocumentTitle(!isOpenPoam() ? "CLOSE " + title : "OPEN " + title);

  return (
    <FullScreen
      handle={fullScreenHandler}
      onChange={(state, handle) => {
        if (state) localStorage.setItem("fullScreen", "poam-root");
      }}
    >
      <Box
        id="poam-root"
        className={`${classes.poamContainer} ${isZoomed() ? "zoomed" : ""}`}
      >
        <PoamHeader
          selectedRow={selectedRow}
          zoom={{ isZoomed, zoomIn, zoomOut }}
          poam={{ id: params.file, poamData, poamName }}
          cols={{ allColumns, secondaryColumns, hiddenColumns }}
          manageCol={{ moveToPrimary, moveToSecondary }}
          manageRow={{ editRowData, addNewRow, openJustify }}
          manageSheet={{ isOpenPoam, showOpenPoam, showClosePoam }}
          manageJira={{ containIssue, showCreateIssue, showUpdateIssue }}
        />

        {isDataLoading ? (
          <SkeletonBox text="Loading.." height="60vh" width="100%" />
        ) : poamData ? (
          <Grid
            container
            spacing={1}
            className={`${classes.gridContainer} ${isZoomed() ? "zoomed" : ""}`}
          >
            <Grid item xs={secondaryOpen !== -1 ? 9 : 12}>
              <DataTable
                className={`${classes.tableStyle} ${isOpenPoam() ? "o" : ""}`}
                verticalBorder={true}
                header={mapDataToHeader()}
                rowList={rows()}
                checkbox={true}
                serialNo={false}
                reiszeTable={true}
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                headerWrapper={(text) => <HeaderCell text={text} />}
                rowWrapper={(text) => <RowCell text={text} />}
                style={{ borderRadius: 0 }}
                minCellWidth={visibleColumns.map(
                  (name) => columns_width[allColumns.indexOf(name)]
                )}
              />
            </Grid>

            {secondaryOpen !== -1 && (
              <Grid item xs={3}>
                <SecondaryTable
                  data={poamData}
                  currentRow={getRowIndex(secondaryOpen)}
                  columnsList={secondaryColumns.filter(
                    (name) => !hiddenColumns.includes(name)
                  )}
                  closeTable={() => setSecondaryOpen(-1)}
                  maxHeight={isZoomed() ? "80vh" : "70vh"}
                />
              </Grid>
            )}
          </Grid>
        ) : (
          <UploadPoam fetchData={fetchData} />
        )}
      </Box>

      {formOpen && (
        <FormDialog
          rows={poamData}
          rowIndex={getRowIndex(getCurrentRow())}
          open={formOpen}
          onClose={closeFormDialog}
          onSubmit={async (val) => {
            // Do edit or new operation
            if (getCurrentRow() !== -1) await updateRowData(val);
            else await createNewRow(val);
            // Reset status
            setSelectedRow([]);
            setFormOpen(false);
          }}
        />
      )}

      {justifyOpen && (
        <JustificationDialog
          isOpen={justifyOpen}
          onClose={closeJustify}
          onSubmit={moveRow}
        />
      )}
    </FullScreen>
  );
}
