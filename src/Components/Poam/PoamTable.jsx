import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  columns_width,
  hidden_columns,
  poam_header,
  poam_header_response_map,
  poam_header_reverse_map,
  secondary_columns,
} from "../../assets/data/PoamData";
import FormDialog from "./FormDialog";
import JustificationDialog from "./JustificationDialog";
import {
  addRow,
  getControlsList,
  getData,
  moveRow,
  updateRow,
} from "../../Service/Poam.service";
import useParams from "../Utils/Hooks/useParams";
import useLoading from "../Utils/Hooks/useLoading";
import { setFullScreenID, isEmpty } from "../Utils/Utils";
import {
  mapDataToHeader,
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
import ActionTracker from "./ActionTracker/ActionTracker";
import PoamDataTable from "./ActionTracker/PoamDataTable";
import PoamDetails from "./PoamDetails";

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

  const [isTaskVisible, setTaskVisible] = useState(false);
  const showTaskTracker = () => setTaskVisible(true);
  const hideTaskTracker = () => setTaskVisible(false);

  //? ----------> USE-EFFECT & FETCH

  // Method to reset state
  const resetPageState = () => {
    setSecondaryOpen(-1);
    setSelectedRow([]);
    setSorting(null);
  };

  // fetch data on mounting component
  // #region Fetch POAM
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

  // Fetch controls list
  // #region Controls
  const [controls, setControls] = useState([])
  useEffect(() => {
    async function fetchControls() {
      // Fetch POA&M data
      const { data, status } = await getControlsList(fileID);
      if (!status) return stopLoading();
      setControls(data)
    }
    fetchControls()
  }, [])

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
      putIssueInData(setPoamData, getPoam, getCurrentIndexes(), params.issueId);
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

  //Method to get multiple Rows Index
  const getCurrentIndexes = () => {
    if (selectedRow.length === 0) return [];
    const offset = isOpenPoam ? 2 : 0;
    return selectedRow.map((row) =>
      getRowIndex(getPoam(), row + offset, sortingMap)
    );
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
      sortingMap,
      controls
    );

  // const [columnWidths, setColumnWidths] = useState([]);
  // useEffect(() => {

  //   const timeout = setTimeout(() => {

  //     if (!poamData?.open || !poamData?.close || visibleColumns.length === 0) return;
  //     const columnWidthsMap = {}

  //     const openPoams = poamData?.open
  //     const closedPoams = poamData?.close

  //     if (isOpenPoam) {
  //       Object.keys(poam_header_reverse_map).forEach((column, colIndex) => {
  //         let maxColumnValueSize = 0;
  //         Object.values(openPoams[column]).forEach((rowValue, rowIndex) => {
  //           const rowValueSize = [0, 1].includes(rowIndex) ? 0 : getElementWidth(`${rowIndex - 2}-${colIndex + 1}`, column);
  //           const rowValueSizeReduced = 0.5 * rowValueSize
  //           maxColumnValueSize = Math.max(maxColumnValueSize, rowValueSizeReduced)
  //         });
  //         const largestCellSize = maxColumnValueSize + 38
  //         if (largestCellSize > columns_width[colIndex]) {
  //           columnWidthsMap[column] = columns_width[colIndex];
  //         }
  //         else {
  //           columnWidthsMap[column] = largestCellSize;
  //         }
  //       })
  //     }
  //     else {
  //       Object.keys(poam_header_reverse_map).forEach((column, colIndex) => {
  //         let maxColumnValueSize = 0;
  //         Object.values(closedPoams[column]).forEach((rowValue, rowIndex) => {
  //           const rowValueSize = getElementWidth(`${rowIndex}-${colIndex + 1}`, column);
  //           const rowValueSizeReduced = 0.5 * rowValueSize
  //           maxColumnValueSize = Math.max(maxColumnValueSize, rowValueSizeReduced)
  //         });
  //         const largestCellSize = maxColumnValueSize + 38
  //         if (largestCellSize > columns_width[colIndex]) {
  //           columnWidthsMap[column] = columns_width[colIndex];
  //         }
  //         else {
  //           columnWidthsMap[column] = largestCellSize;
  //         }
  //       })
  //     }
  //     const widths = poam_header.map((h, i) => columnWidthsMap[h])
  //     setColumnWidths(widths)

  //   }, 0)

  //   return () => clearTimeout(timeout)
  // }, [poamData, visibleColumns, isOpenPoam, controls])

  function getElementWidth(id, column) {
    const el = document.getElementById(id);
    if (!el) return 0;
    return el.scrollWidth;
  }

  // ? ----------> ROW MANUPULATION METHODS

  // Method to create new row
  const createNewRow = async (newRow) => {
    let newIndex = getLastIndex(getPoam()) + 1;
    const { data, status } = await addRow(fileID, newRow, newIndex);

    // Creating mapping for response format from new to old
    const mappedDataNewToOld = {};
    Object.values(poam_header_response_map).map((val, index) => {
      mappedDataNewToOld[val] = {};
    });
    data.map((row, index) => {
      Object.keys(row).map((col, colIndex) => {
        mappedDataNewToOld[poam_header_response_map[col]][newIndex] = row[col];
      });
    });

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
    if (status)
      updatePoamRow(setPoamData, getPoam, mappedDataNewToOld, rowIndex);
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
    const rowIndexes = getCurrentIndexes();
    if (rowIndexes && rowIndexes.length > 1) return false;
    const rowIndex = rowIndexes[0];
    return rowIndex !== -1 && !isEmpty(getPoam()?.["jira_issues"]?.[rowIndex]);
  };

  // Method to set rowindex in param and show createIssue dialog
  const showCreateIssue = () => {
    // Adding multiple selected rowIds in params, so that it can be accessed by CreateIssue component, to send it to backend.
    const rowIndexes = getCurrentIndexes();
    if (rowIndexes.length > 0) {
      const rowIds = rowIndexes
        .map((index) => getPoam()["id"][index])
        .join(",");
      return changeParams({
        rowIndex: rowIndexes,
        createIssue: true,
        rowId: rowIds,
      });
    }
  };

  // Method to set issue details in param and show updateIssue dialog
  const showUpdateIssue = () =>
    changeParams({
      issues: JSON.stringify(getPoam()["jira_issues"][getCurrentIndex()]),
      updateIssue: true,
    });

  // ? ----------> SEARCH

  const [matchedCell, setMatched] = useState([]);
  const [searchSelected, setSelected] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setMatched((prev) =>
      prev.map((cell, idx) => ({
        ...cell,
        selected: searchSelected === idx,
      }))
    );
    setTimeout(() => {
      const active = document.activeElement;
      document
        .querySelector("td[data-searched='true']")
        ?.scrollIntoView({
          block: "center", // Ensures vertical centering of the cell
          inline: "center", // Ensures horizontal centering of the cell
        })
        ?.focus();
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
      {isTaskVisible ? (
        <ActionTracker
          poamContainer={classes.poamContainer}
          isZoomed={isZoomed}
          closeTasktracker={hideTaskTracker}
          poamData={poamData}
        />
      ) : (
        <>
          <PoamDataTable
            classes={classes}
            fullScreen={{ isZoomed, zoomIn, zoomOut }}
            data={{
              selectedRow,
              setSelectedRow,
              fileID,
              poamData,
              getPoam,
              setSecondaryOpen,
              getRowIndex,
              sortingMap,
              poamDetails,
              isLoading,
            }}
            manageCol={{
              allColumns,
              secondaryColumns,
              hiddenColumns,
              visibleColumns,
              moveToPrimary,
              moveToSecondary,
            }}
            manageRow={{ openEditFrom, openCreateForm, openJustify }}
            manageSheet={{ isOpenPoam, showOpenPoam, showClosePoam }}
            manageJira={{ containIssue, showCreateIssue, showUpdateIssue }}
            manageTask={{ isTaskVisible, showTaskTracker, hideTaskTracker }}
            search={{
              matchedCell,
              setMatched,
              searchSelected,
              setSelected,
              setSearchTerm,
              searchTerm,
            }}
            manageTable={{
              secondaryOpen,
              mapTableHeader,
              mapTableBody,
              columns_width: columns_width,
            }}
          />
        </>)}

      <FormDialog
        poamID_data={getPoamID_data(poamData)}
        rows={getPoam()}
        rowIndex={getCurrentIndex()}
        open={formOpen}
        onClose={closeFormDialog}
        onSubmit={onFormSubmit}
        controls={controls}
      />

      <JustificationDialog
        isOpen={justifyOpen}
        onClose={closeJustify}
        onSubmit={moveRowData}
      />
    </FullScreen>
  );
}
