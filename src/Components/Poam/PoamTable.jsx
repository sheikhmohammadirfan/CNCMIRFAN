import { Box, Button, Grid, Icon, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  columns_width,
  hidden_columns,
  poam_header,
  poam_header_response_map,
  secondary_columns,
} from "../../assets/data/PoamData";
import FormDialog from "./FormDialog";
import JustificationDialog from "./JustificationDialog";
import PoamHeader from "./PoamHeader";
import SecondaryTable from "./SecondaryTable";
import DataTable from "../Utils/DataTable/DataTable";
import SkeletonBox from "../Utils/SkeletonBox";
import {
  addRow,
  getData,
  moveRow,
  moveToClose,
  moveToOpen,
  updateRow,
} from "../../Service/Poam.service";
import useParams from "../Utils/Hooks/useParams";
import useLoading from "../Utils/Hooks/useLoading";
import { setFullScreenID, copyObject, isEmpty } from "../Utils/Utils";
import {
  HeaderCell,
  mapDataToHeader,
  RowCell,
  generateRows,
  useStyle,
  getRowIndex,
  updateColumns,
  putIssueInData,
  getLastIndex,
  updatePoamRow,
  getRowData,
  movePoamRow,
  getPoamID_data,
  getSortingMap,
} from "./PoamUtils";
import PoamDetails from "./PoamDetails";
import jira from "../../assets/img/jira-brands.svg";

/* POA&M TABLE COMPONENT */
export default function PoamTable({ fileID }) {
  const classes = useStyle();

  //? ----------> STATES

  // Fullscreen handler to zoom in and zoom out
  const fullScreenHandler = useFullScreenHandle();
  const zoomIn = fullScreenHandler.enter;
  const zoomOut = fullScreenHandler.exit;
  const isZoomed = () => fullScreenHandler.active;

  // Custom hook to handle Query params
  const { params, changeParams, deleteParams } = useParams("issueId");

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // React State to save table data
  const [poamData, setPoamData] = useState();
  // Method to get open/close POA&M data based on isOpenPoamState
  const getPoam = (data) => {
    let obj = data || poamData;
    return obj ? (isOpenPoam ? obj?.open : obj?.close) : {};
  };

  // State for details
  const [poamDetails, setPoamDetails] = useState({
    cspName: "",
    systemName: "",
    agencyName: "",
  });

  // React State to save table name (removed since now details are being displayed from main header component)

  // List for all types of columns
  const [allColumns, setAllColumns] = useState(poam_header);
  const [hiddenColumns, sethiddenColumns] = useState(hidden_columns);
  const [secondaryColumns, setSecondaryColumns] = useState(secondary_columns);
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    const _l = document.querySelectorAll("table [poam-id]");
    for (let i = 0; i < _l.length; i++) {
      _l[i].style.left = "50px";
    }
  }, [visibleColumns]);

  // React state to maintain POA&M sheet status
  const [isOpenPoam, setPoamSheet] = useState(true);
  const showOpenPoam = () => setPoamSheet(true);
  const showClosePoam = () => setPoamSheet(false);

  // hook to store selected rows
  const [selectedRow, setSelectedRow] = useState([]);

  // hook to store index of data to be shown in secondary table
  const [secondaryOpen, setSecondaryOpen] = useState(-1);
  const moveToSecondary = (colName) =>
    setSecondaryColumns((prevCol) => [...prevCol, colName]);
  const moveToPrimary = (colName) =>
    setSecondaryColumns((prevCol) => prevCol.filter((c) => c !== colName));

  // React state to maintain justify dailog status
  const [justifyOpen, setJustifyOpen] = useState(false);
  const openJustify = () => setJustifyOpen(true);
  const closeJustify = () => setJustifyOpen(false);

  // React State to managing dailog visibility and state
  const [formOpen, setFormOpen] = useState(false);
  const openEditFrom = () => setFormOpen(true);
  const openCreateForm = () => resetPageState() & setFormOpen(true);
  const closeFormDialog = () => setFormOpen(false);

  //? ----------> USE-EFFECT & FETCH

  // Method to reset state
  const resetPageState = () => {
    setSecondaryOpen(-1);
    setSelectedRow([]);
    setSorting(null);
  };

  // fetch data on mounting component
  useEffect(() => {
    (async () => {
      startLoading();
      // Fetch POA&M data
      const { data, status } = await getData(fileID);
      if (!status) return stopLoading();
      // Update state
      setPoamData({ open: data.open_data, close: data.closed_data });
      setPoamDetails({
        cspName: data.csp,
        systemName: data.system_name,
        agencyName: data.agency_name,
      });
      stopLoading();
    })();
  }, []);

  // Reset page state on sheet change or data change
  useEffect(() => resetPageState(), [poamData, isOpenPoam]);

  // Update visible cols on secondary column change
  useEffect(
    () => setVisibleColumns(updateColumns(allColumns, secondaryColumns)),
    [allColumns, secondaryColumns]
  );

  // Check if issueId is passed, after creating issue, then update the poam data
  useEffect(() => {
    if (params.issueId) {
      putIssueInData(setPoamData, getPoam, getCurrentIndex(), params.issueId);
      deleteParams("issueId");
    }
  }, [params]);

  //? ----------> TABLE METHODS

  // Method to get row index from lis index
  const getCurrentIndex = () => {
    if (selectedRow.length === 0) return -1;
    // Else get rowindex by adding offset if it is open poam
    const offset = isOpenPoam ? 2 : 0;
    return getRowIndex(getPoam(), selectedRow[0] + offset, sortingMap);
  };

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(visibleColumns, sorting, updateSort);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      getPoam(),
      isOpenPoam,
      visibleColumns,
      selectedRow,
      secondaryOpen,
      setSecondaryOpen,
      matchedCell,
      sortingMap
    );

  // ? ----------> ROW MANUPULATION METHODS

  // Method to create new row
  const createNewRow = async (newRow) => {
    let newIndex = getLastIndex(getPoam()) + 1;
    const { data, status } = await addRow(fileID, newRow, newIndex);

    // Creating mapping for response format from new to old
    const mappedDataNewToOld = {};
    Object.values(poam_header_response_map).map((val, index) => {
      mappedDataNewToOld[val] = {}
    })
    data.map((row, index) => {
      Object.keys(row).map((col, colIndex) => {
        mappedDataNewToOld[poam_header_response_map[col]][newIndex] = row[col];
      })
    })

    // Passing the mappedData to updatePoamRow method
    if (status)
      updatePoamRow(setPoamData, getPoam, mappedDataNewToOld, newIndex);
  };

  // Method to edit existing row
  const updateRowData = async (newRow) => {
    const rowIndex = getCurrentIndex();

    const rowData = getRowData(getPoam(), rowIndex);
    // Adding fields id and poam_file in the payload
    newRow.id = rowData.id;
    newRow.poam_file = rowData.poam_file;

    const { data, status } = await updateRow(fileID, newRow, rowIndex);

    // newData is in new format. mappedDataNewToOld will convert it to old format which is expeced for current logic
    const mappedDataNewToOld = {};
    Object.keys(data).map((colName, colIndex) => {
      mappedDataNewToOld[poam_header_response_map[colName]] = {
        [rowIndex]: data[colName],
      };
    });

    // passing mapped data to updatePoamRow method instead of data which is in new format
    if (status) updatePoamRow(setPoamData, getPoam, mappedDataNewToOld, rowIndex);
  };

  // Method to call on submiting form
  const onFormSubmit = async (val) => {
    // Do edit or new operation
    if (getCurrentIndex() !== -1) await updateRowData(val);
    else await createNewRow(val);
    // Reset status
    setFormOpen(false);
  };

  // Method to move row to & from OPEN & CLOSE
  const moveRowData = async (justification) => {
    // From index
    const rowIndex = getCurrentIndex();
    // To index
    const newIndex = getLastIndex(poamData[isOpenPoam ? "close" : "open"]) + 1;

    // Get data to move & add justification
    const rowData = getRowData(getPoam(), rowIndex);
    rowData.justification = justification;

    // Make api call
    const res = await moveRow(fileID, rowData, isOpenPoam, rowIndex, newIndex);
    if (res.status)
      movePoamRow(setPoamData, isOpenPoam, rowData, rowIndex, newIndex);
  };

  // ? ----------> JIRA ISSUE METHODS

  // Method to check if row contains any issue
  const containIssue = () => {
    const rowIndex = getCurrentIndex();
    return rowIndex !== -1 && !isEmpty(getPoam()["jira_issues"][rowIndex]);
  };

  // Method to set rowindex in param and show createIssue dialog
  const showCreateIssue = () => {
    // Adding rowId in params, so that it can be accessed by CreateIssue component, to send it to backend.
    const rowIndex = getCurrentIndex();
    return changeParams({ rowIndex: getCurrentIndex(), createIssue: true, rowId: getPoam()["id"][rowIndex] });
  }

  // Method to set issue details in param and show updateIssue dialog
  const showUpdateIssue = () =>
    changeParams({
      issues: JSON.stringify(getPoam()["jira_issues"][getCurrentIndex()]),
      updateIssue: true,
    });

  // ? ----------> SEARCH

  const [matchedCell, setMatched] = useState([]);
  const [searchSelected, setSelected] = useState(-1);
  useEffect(() => {
    setMatched((prev) =>
      prev.map((cell, idx) => ({
        ...cell,
        selected: searchSelected === idx,
      }))
    );
    setTimeout(() => {
      const active = document.activeElement;
      document.querySelector("td[data-searched='true']")?.scrollIntoView({
        block: 'center',    // Ensures vertical centering of the cell
        inline: 'center'    // Ensures horizontal centering of the cell
      })?.focus();
      if (active.tagName === "INPUT") {
        active.focus();
      }
    }, 0);
  }, [searchSelected]);

  // ? ----------> Sorting

  const [sorting, setSorting] = useState(null);
  const updateSort = (colName) => {
    let currSort = {};
    if (sorting) {
      currSort = { ...sorting };
    }
    if (currSort.column === colName) {
      currSort.order = currSort.order === "asc" ? "dsc" : "asc";
    } else {
      currSort = {
        column: colName,
        order: "asc",
      };
    }
    setSorting(currSort);
  };
  const [sortingMap, updateMap] = useState(null);
  useEffect(() => {
    if (sorting) {
      updateMap(getSortingMap(getPoam(), isOpenPoam, sorting));
    } else {
      updateMap(null);
    }
  }, [sorting]);

  // ? ----------> UI COMPONENTS

  return (
    <FullScreen
      handle={fullScreenHandler}
      onChange={(state) => setFullScreenID(state, "poam-root")}
    >
      <Box
        id="poam-root"
        className={`${classes.poamContainer} ${isZoomed() ? "zoomed" : ""}`}
      >
        <PoamHeader
          selectedRow={selectedRow}
          zoom={{ isZoomed, zoomIn, zoomOut }}
          details={{ fileID }}
          poamData={poamData}
          cols={{ allColumns, secondaryColumns, hiddenColumns, visibleColumns }}
          manageCol={{ moveToPrimary, moveToSecondary }}
          manageRow={{ openEditFrom, openCreateForm, openJustify }}
          manageSheet={{ isOpenPoam, showOpenPoam, showClosePoam }}
          manageJira={{ containIssue, showCreateIssue, showUpdateIssue }}
          search={{
            matchedCell,
            setMatched,
            searchSelected,
            setSelected,
          }}
        />

        <PoamDetails
          poamDetails={poamDetails}
          loading={isLoading()}
        />

        {isLoading() ? (
          <SkeletonBox text="Loading.." height="60vh" width="100%" />
        ) : (
          <Grid
            container
            spacing={1}
            className={`${classes.gridContainer} ${isZoomed() ? "zoomed" : ""}`}
          >
            <Grid item xs={secondaryOpen !== -1 ? 9 : 12}>
              <DataTable
                className={`poam-table ${classes.tableStyle} ${isOpenPoam ? "o" : ""}`}
                verticalBorder={true}
                header={mapTableHeader()}
                rowList={mapTableBody()}
                checkbox={true}
                serialNo={false}
                resizeTable={true}
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                headerWrapper={(text) => <HeaderCell text={text} />}
                rowWrapper={(text) => <RowCell text={text} />}
                style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                minCellWidth={visibleColumns.map(
                  (name) => columns_width[allColumns.indexOf(name)]
                )}
              />
            </Grid>

            <SecondaryTable
              data={getPoam()}
              currentRow={getRowIndex(getPoam(), secondaryOpen, sortingMap)}
              columnsList={secondaryColumns.filter(
                (name) => !hiddenColumns.includes(name)
              )}
              closeTable={() => setSecondaryOpen(-1)}
            />
          </Grid>
        )}
      </Box>

      <FormDialog
        poamID_data={getPoamID_data(poamData)}
        rows={getPoam()}
        rowIndex={getCurrentIndex()}
        open={formOpen}
        onClose={closeFormDialog}
        onSubmit={onFormSubmit}
      />

      <JustificationDialog
        isOpen={justifyOpen}
        onClose={closeJustify}
        onSubmit={moveRowData}
      />
    </FullScreen>
  );
}
