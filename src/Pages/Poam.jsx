import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  Icon,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useHistory, useLocation } from "react-router-dom";
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
import DialogBox from "../Components/Utils/DialogBox";
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

// Generate css style
const useStyle = makeStyles((theme) => ({
  //Header cell style
  headerCell: { fontWeight: "bold" },

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

/** POAM PAGE COMPONENT */
function Poam({ title }) {
  const classes = useStyle();

  // Fullscreen handler to zoom in and zoom out
  const fullScreenHandler = useFullScreenHandle();
  const zoomIn = fullScreenHandler.enter;
  const zoomOut = fullScreenHandler.exit;
  const isZoomed = () => fullScreenHandler.active;

  // React hook, to change routes
  const history = useHistory();

  // React hook, to update state of query params
  const location = useLocation();

  // React state to maintain loading status
  const [isDataLoading, setIsDataLoading] = useState(false);
  const startLoading = () => setIsDataLoading(true);
  const stopLoading = () => setIsDataLoading(false);

  // React state to store Query params obj
  const [queryParams, setQueryParams] = useState({});
  // Get sheet status
  const isOpenPoam = (params = queryParams) => params.sheet !== "close";

  const [justifyOpen, setJustifyOpen] = useState(false);
  const openJustify = () => setJustifyOpen(true);
  const closeJustify = () => setJustifyOpen(false);

  // hook to store selected rows
  const [selectedRow, setSelectedRow] = useState([]);

  // hook to store index of current clicked row
  const [currentRow, setcurrentRow] = useState(-1);

  // hook to store index of data to be shown in secondary tabel
  const [secondaryOpen, setSecondaryOpen] = useState(-1);

  // Change status of poam
  const onPoamChange = (status = isOpenPoam) =>
    history.push(`/support?sheet=${status ? "open" : "close"}`);
  const showOpenPoam = () => onPoamChange(true);
  const showClosePoam = () => onPoamChange(false);

  // State to managing dailog visibility
  const [formOpen, setFormOpen] = useState(false);
  const editRowData = () => {
    setcurrentRow(selectedRow[0] + (isOpenPoam() ? 2 : 0));
    setFormOpen(true);
  };
  const addNewRow = () => {
    setcurrentRow(-1);
    setFormOpen(true);
  };
  const closeFormDialog = () => setFormOpen(false);

  // State to save table data
  const [poamData, setPoamData] = useState();

  // List for all types of columns
  const [allColumns, setAllColumns] = useState(poam_header);
  const [hiddenColumns, sethiddenColumns] = useState(hidden_columns);
  const [secondaryColumns, setSecondaryColumns] = useState(secondary_columns);
  const [visibleColumns, setVisibleColumns] = useState();

  // Update visible cols on secondary column change
  useEffect(
    () =>
      setVisibleColumns(
        allColumns.filter((colName) => !secondaryColumns.includes(colName))
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
  const fetchData = async (params = {}) => {
    startLoading();
    const { data, status } = await getData(isOpenPoam(params));
    if (status) setPoamData(data);
    stopLoading();
  };

  // Reset Current_Row, Selected_Row & update Query_Params state on route change
  useEffect(() => {
    // Set current params
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    setQueryParams(params);

    // Reset table
    setcurrentRow(-1);
    setSelectedRow([]);

    fetchData(params);
  }, [location]);

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
    const rowIndex = getRowIndex(currentRow);
    const { data, status } = await updateRow(rowIndex, newData);

    if (status)
      setPoamData((prevData) =>
        updatePoam(prevData, data, allColumns, rowIndex)
      );
  };

  // Method to move row to & from OPEN & CLOSE
  const moveRow = async (justification) => {
    // Get data
    const rowIndex = getRowIndex(currentRow);
    const rowData = getRowData(rowIndex, allColumns, poamData);

    // Add justification
    rowData.justification = justification;

    // Make api call
    const { data, status } = await (isOpenPoam()
      ? moveToClose(rowIndex, rowData)
      : moveToOpen(rowIndex, rowData));

    // reset data
    if (status) {
      setPoamData(data);
      setSelectedRow([]);
    }
  };

  DocumentTitle(!isOpenPoam() ? "CLOSE " + title : "OPEN " + title);

  return (
    <FullScreen handle={fullScreenHandler}>
      <Box padding={isZoomed() ? 3 : 1}>
        <PoamHeader
          selectedRow={selectedRow}
          zoom={{ isZoomed, zoomIn, zoomOut }}
          data={poamData}
          cols={{ allColumns, secondaryColumns, hiddenColumns }}
          manageCol={{ moveToPrimary, moveToSecondary }}
          manageRow={{ editRowData, addNewRow, openJustify }}
          manageSheet={{ isOpenPoam, showOpenPoam, showClosePoam }}
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
          rowIndex={getRowIndex(currentRow)}
          open={formOpen}
          onClose={closeFormDialog}
          onSubmit={async (val) => {
            // Do edit or new operation
            if (currentRow !== -1) await updateRowData(val);
            else await createNewRow(val);
            // Reset status
            setcurrentRow(-1);
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

export default Poam;
