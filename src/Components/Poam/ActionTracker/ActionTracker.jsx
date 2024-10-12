import React, { useEffect, useRef, useState } from "react";
import actionTrackerFilters from "../../../assets/data/PoamManagement/ActionTracker/ActionTrackerFilters";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import ActionTrackerHeader from "./ActionTrackerHeader";
import AddActionDialog from "./AddActionDialog";
import useLoading from "../../Utils/Hooks/useLoading";
import {
  HeaderCell,
  generateRows,
  mapDataToHeader,
  useStyle,
} from "./ActionTrackerUtils";
import {
  ACTION_TABLE_COL_WIDTHS,
  ACTION_TRACKER_COLUMNS,
  HEADER_TABLE_COLS_MAP,
} from "../../../assets/data/PoamManagement/ActionTracker/ActionTrackerColumns";
import SkeletonBox from "../../Utils/SkeletonBox";
import DataTable from "../../Utils/DataTable/DataTable";
import { deletes, patch, put } from "../../../Service/CrudFactory";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { getOwners } from "../../../Service/RiskManagement/RiskManagement.service.jsx"; // for owners filter dropdown
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import XLSX from "xlsx";
import ExportFile from "../../Utils/ExportFile";
import { exportAction, getActions } from "../../../Service/Poam.service.jsx";

const ActionTracker = ({
  poamContainer,
  isZoomed,
  closeTasktracker,
  poamData,
}) => {
  const history = useHistory();
  const { isLoading, startLoading, stopLoading } = useLoading({
    table: false,
    backdrop: false,
  });

  const [owners, setOwners] = useState([]);
  const [actions, setActions] = useState([]);
  const prevPayload = useRef("");
  const searchedValue = useRef("");
  const abortControllerRef = useRef(null);
  const filterStringified = useRef("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [matchedCell, setMatchedCell] = useState([]);
  const [register, setRegister] = useState([]);
  const [actionDialog, setActionDialog] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 10,
    total_items: null,
    total_pages: null,
  });

  const updatePageSize = (size) =>
    setPagination((prev) => ({ ...prev, page_no: 1, page_size: size }));
  const updatePageNumber = (page) =>
    setPagination((prev) => ({ ...prev, page_no: page }));

  const [sorting, setSorting] = useState(null);
  const updateSort = (colName) => {
    let currSort = {};
    if (sorting) {
      currSort = { ...sorting };
    }
    if (currSort.sort_by === HEADER_TABLE_COLS_MAP[colName]) {
      currSort.sort_order = currSort.sort_order === 1 ? -1 : 1;
    } else {
      currSort = {
        sort_by: HEADER_TABLE_COLS_MAP[colName],
        sort_order: 1,
      };
    }
    setSorting(currSort);
  };
  const fetchandSetActionTable = async (reload) => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const payload = {
      filters: {},
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no,
      ...sorting,
    };
    if (filters.assignee.length > 0) {
      payload.filters["assignee"] = filters.assignee;
    }
    const newPayload = JSON.stringify(payload);
    if (prevPayload.current === newPayload && !reload) return;
    prevPayload.current = newPayload;

    // ABORT CONTROLLER TO CONTROL REQUESTS
    // Abort previous requests if any, before firing a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Setting up abort controller to cancel current request if immediately another is fired
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    startLoading("table");
    const { data, status } = await getActions(payload, { signal: signal });

    if (!status) {
      stopLoading("table");
      return;
    }

    let paginationData = {
      page_no: data.page_no,
      page_size: data.page_size,
      total_items: data.total_items,
      total_pages: data.total_pages,
    };
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setActions(data.actions);
      setPagination({ ...paginationData });
      if (id) {
        const rowIndex = data.actions.findIndex((d) => d.id === parseInt(id));
        if (rowIndex !== -1) {
          setSelectedRows([rowIndex]);
          openAddActionForm();
          history.push("/poam/action-tracker");
        }
      }
      stopLoading("table");
    }
  };

  const fetchOwners = async () => {
    const res = await getOwners();
    if (res.status) {
      setOwners(res.data);
    }
  };

  useEffect(() => {
    fetchOwners();
    fetchandSetActionTable();
  }, [pagination, sorting]);

  const [columns, setColumns] = useState(ACTION_TRACKER_COLUMNS);

  const [filterDropdowns, setFilterDropdowns] = useState(actionTrackerFilters);
  useEffect(() => {
    setFilterDropdowns((prev) => ({
      ...prev,
      assignee: {
        ...prev.assignee,
        options: owners.map((owner) => ({
          id: owner.id,
          val: owner.id,
          text: `${owner.first_name} ${owner.last_name}`,
        })),
      },
    }));
  }, [owners]);

  const [filters, setFilters] = useState({
    assignee: [],
    internal_status: [],
    integration_status: [],
  });

  const changeFilters = (filterName, updatedFilterIds) => {
    setFilters((prev) => {
      return {
        ...prev,
        [filterName]: updatedFilterIds,
      };
    });
  };

  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
  };

  const filterTrigger = () => {
    if (filterStringified.current === JSON.stringify(filters)) return;
    filterStringified.current = JSON.stringify(filters);
    setPagination((prev) => ({ ...prev, page_no: 1 }));
  };

  const onSearch = (val) => {
    searchedValue.current = val;
    fetchandSetActionTable();
  };

  const openAddActionForm = () => setActionDialog(true);
  const closeAddActionForm = () => setActionDialog(false);

  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  };

  const handleAddActionFormSubmit = async (values, isCreateAction) => {
    const date = new Date(values.due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      poam_row: values.risk.val,
      task: values.action,
      due_date: formattedDate,
      assignee: owners.find((owner) => owner.id === values.owner)?.id || "",
      notes: values.notes,
      task_type: "custom",
      // source_id: 1,
    };

    let res;
    if (isCreateAction) {
      res = await put("poam/tasks/", payload);
      if (res.status) {
        fetchandSetActionTable(true);
        setSelectedRows([]);
      }
    } else {
      delete payload["poam_row"];
      const idToUpdate = actions[getCurrentIndex()].id;
      res = await patch(`poam/tasks/${idToUpdate}`, payload);
      if (res.status) {
        setSelectedRows([]);
        fetchandSetActionTable(true);
      }
    }
    setActionDialog(false);
  };

  const deleteAction = async () => {
    const idToDelete = actions[getCurrentIndex()].id;
    const res = await deletes(`/poam/tasks/${idToDelete}`);
    if (res.status) {
      setSelectedRows([]);
      fetchandSetActionTable(true);
    }
    setDeleteConfirmationOpen(false);
  };

  const getRegisterOptions = () => {
    if (!poamData || !Object.entries(poamData)) {
      return [];
    }
    const openOptions = Object.entries(poamData.open["POAM ID"]).map((val) => {
      const idx = val[0];
      const poamId = val[1];
      const poamRowId = poamData.open["id"][idx];
      return { val: poamRowId, text: poamId };
    });
    const closeOptions = Object.entries(poamData.close["POAM ID"]).map(
      (val) => {
        const idx = val[0];
        const poamId = val[1];
        const poamRowId = poamData.open["id"][idx];
        return { val: poamRowId, text: poamId };
      }
    );
    return [...openOptions, ...closeOptions];
  };

  const openExportDialog = async () => {
    startLoading("backdrop");
    const { data, status } = await exportAction();
    if (!status) {
      stopLoading("backdrop");
      return;
    }

    const finalData = data.map(mapRiskRows);

    const sheetOpen = XLSX.utils.json_to_sheet(finalData);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheetOpen, "Actions");
    XLSX.write(book, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(book, `poam-actions.xlsx`);

    stopLoading("backdrop");
  };

  const closeExportDialog = () => setExportDialog(false);

  const mapRiskRows = (row) => {
    let mappedRow = {};
    const poamData = getRegisterOptions();
    Object.keys(row).forEach((key) => {
      if (key === "poam_row")
        mappedRow["risk"] = poamData.find(
          (risk) => risk.val === row["poam_row"]
        ).text;
      if (key === "assignee")
        mappedRow[
          "assignee"
        ] = `${row.assignee.first_name} ${row.assignee.last_name}`;
      else mappedRow[key] = row[key];
    });
    return mappedRow;
  };

  const getColumns = () =>
    columns.map((colName) => HEADER_TABLE_COLS_MAP[colName]);

  const mapTableHeader = () => mapDataToHeader(columns, sorting, updateSort);

  const mapTableBody = () =>
    generateRows(
      actions,
      getColumns(),
      getRegisterOptions(),
      owners,
      selectedRows,
      matchedCell
    );

  const classes = useStyle();

  return (
    <Box
      id="poam-root"
      className={`${poamContainer} ${isZoomed() ? "zoomed" : ""}`}
    >
      <Box className={classes.actionTrackerContainer}>
        <ActionTrackerHeader
          tableFilters={filterDropdowns}
          filters={{ filters, changeFilters, clearFilters }}
          triggerFilters={filterTrigger}
          selectedRows={selectedRows}
          openAddActionForm={openAddActionForm}
          openExportDialog={openExportDialog}
          openDeleteConfirmationDialog={() => setDeleteConfirmationOpen(true)}
          onSearch={onSearch}
          closeTasktracker={closeTasktracker}
        />

        {isLoading("table") ? (
          <SkeletonBox text="Loading.." height="60vh" width="100%" />
        ) : (
          <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12}>
              <DataTable
                className={classes.tableStyle}
                verticalBorder={true}
                header={mapTableHeader()}
                rowList={mapTableBody()}
                checkbox={true}
                minCheckboxWidth={50}
                serialNo={false}
                resizeTable={false}
                resizeAfterColumns={1}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                headerWrapper={(text) => <HeaderCell text={text} />}
                // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
                style={{
                  borderRadius: 5,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                minCellWidth={columns.map(
                  (name) => ACTION_TABLE_COL_WIDTHS[columns.indexOf(name)]
                )}
                // Pagination props
                currentPage={pagination.page_no}
                pageSize={pagination.page_size}
                totalItems={pagination.total_items}
                updatePageSize={updatePageSize}
                updatePageNumber={updatePageNumber}
              />
            </Grid>

            {/* <SecondaryTable
            data={getPoam()}
            currentRow={getRowIndex(getPoam(), secondaryOpen, sortingMap)}
            columnsList={secondaryColumns.filter(
              (name) => !hiddenColumns.includes(name)
            )}
            closeTable={() => setSecondaryOpen(-1)}
          /> */}
          </Grid>
        )}

        {actionDialog && (
          <AddActionDialog
            open={actionDialog}
            closeHandler={closeAddActionForm}
            risks={getRegisterOptions()}
            actionVal={actions[getCurrentIndex()]}
            isCreateAction={getCurrentIndex() === -1}
            owners={owners.map((owner) => ({
              val: owner.id,
              text: `${owner.first_name} ${owner.last_name}`,
            }))}
            onFormSubmit={handleAddActionFormSubmit}
          />
        )}

        <DeleteConfirmationDialog
          open={deleteConfirmationOpen}
          closeHandler={() => setDeleteConfirmationOpen(false)}
          deleteAction={deleteAction}
        />

        {/* For loading when export is done */}
        <Backdrop className={classes.backdrop} open={isLoading("backdrop")}>
          <CircularProgress color="inherit" />
          <Typography className="backdrop-label" variant="h5">
            Please wait...
          </Typography>
        </Backdrop>

        <ExportFile
          open={exportDialog}
          dialogTitle="Export All POAM Actions"
          close={closeExportDialog}
          allColumns={[]}
          hiddenColumns={[]}
          dataFetcher={exportAction}
          dataMapper={mapRiskRows}
        />
      </Box>
    </Box>
  );
};

export default ActionTracker;
