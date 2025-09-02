import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import RiskRegisterHeader from "./RiskRegisterHeader";
import DataTable from "../../Utils/DataTable/DataTable";
import {
  HeaderCell,
  generateRows,
  getRowIndex,
  mapDataToHeader,
  useStyle,
} from "./RiskRegisterUtils";
import {
  HEADER_TABLE_COLS_MAP,
  risk_register_columns,
  risk_register_columns_width,
} from "../../../assets/data/RiskManagement/RiskRegister/RiskRegisterColumns";
import {
  getRegister,
  createRisk,
  updateRegister,
  importRisk,
  exportRisk,
} from "../../../Service/RiskManagement/RiskRegister.service";
import useLoading from "../../Utils/Hooks/useLoading";
import SkeletonBox from "../../Utils/SkeletonBox";
import RiskManagementContext from "../RiskManagementContext";
import RiskRegisterFilters, {
  cia_categories,
} from "../../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters";
import RiskFormDialog from "../RiskFormDialog";
import AddActionDialog from "../AddActionDialog";
import { getLibrary } from "../../../Service/RiskManagement/RiskLibrary.service";
import { TREATMENT_NAME_ID_MAP } from "../../../assets/data/RiskManagement/RiskTreatments";
import useSlider from "../../Utils/Hooks/useSlider";
import { put } from "../../../Service/CrudFactory";
import UploadFileDialog from "../../Utils/UploadFileDialog";
import {
  COL_TOOLTIP_MAP,
  OPTIONAL_COLUMNS,
  REQUIRED_COLUMNS,
} from "../../../assets/data/RiskManagement/RiskRegister/ImportCols";
import { notification } from "../../Utils/Utils";
import ExportFile from "../../Utils/ExportFile";
import XLSX from "xlsx";
import { obj_to_yyyy_mm_dd } from "../../Utils/DateFormatConverter";
import { getUser } from "../../../Service/UserFactory";

// Add DETECTED_FROM_CHOICES constant
const DETECTED_FROM_CHOICES = [
  { val: 0, text: "Third-Party Risk Assessment" },
  { val: 1, text: "Internal Audit" },
  { val: 2, text: "External Audit" },
  { val: 3, text: "Vulnerability Scan" },
  { val: 4, text: "Security Assessment" },
  { val: 5, text: "User Report" },
  { val: 6, text: "Compliance Review" },
  { val: 7, text: "Penetration Testing" },
];

const RiskRegister = () => {
  const hasEditRiskAccess = useMemo(() => {
    const user = getUser();
    return Boolean(
      user.roles[0].permissions.find((p) => p.permission_name === "edit_risk")
    );
  }, []);

  const hasEditActionAccess = useMemo(() => {
    const user = getUser();
    return Boolean(
      user.roles[0].permissions.find((p) => p.permission_name === "edit_action")
    );
  }, []);

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading({
    register: false,
    contextData: false,
    export: false,
  });

  const [isContextLoading, setContextLoading] = useState(true);
  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const {
    categories: { categories },
    owners: { owners },
    scores,
  } = useContext(RiskManagementContext);
  useEffect(() => {
    if (
      categories.length > 0 &&
      owners.length > 0 &&
      scores.likelihoodScores.length > 0 &&
      scores.impactScores.length > 0 &&
      scores.riskScoreGroups.length > 0
    ) {
      setContextLoading(false);
    }
  }, [categories, owners, scores]);

  // Get filters to show in table header
  const [filterDropdowns, setFilterDropdowns] = useState(RiskRegisterFilters);
  useEffect(() => {
    setFilterDropdowns((prev) => ({
      ...prev,
      owners: {
        ...prev.owners,
        options: owners.map((o) => ({
          id: o.id,
          text: `${o.first_name} ${o.last_name}`,
        })),
      },
      category: {
        ...prev.category,
        options: categories.map((c) => ({ id: c.id, text: c.category_name })),
      },
      inherentRisk: {
        ...prev.inherentRisk,
        options:
          scores.riskScoreGroups?.map((c) => ({ id: c.id, text: c.name })) ||
          [],
      },
      residualRisk: {
        ...prev.residualRisk,
        options:
          scores.riskScoreGroups?.map((c) => ({ id: c.id, text: c.name })) ||
          [],
      },
    }));
  }, [categories, owners, scores]);

  const prevPayload = useRef("");
  const searchedValue = useRef("");
  // If this state has some key missing from RiskRegisterFilters.jsx in data folder, it will result in error.
  // That is why, all the keys in this state are predefined.
  const [filters, setFilters] = useState({
    owners: [],
    category: [],
    treatment: [],
    inherent: [],
    residual: [],
    ciaCategories: [],
    source: [],
    status: [],
    identified: [],
    vendor: [],
  });

  const [filterMetadata, setFilterMetadata] = useState({
    identified: {
      3: {
        fromDate: null,
        toDate: null,
      },
    },
  });

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const updatePageSize = (size) =>
    setPagination((prev) => ({ ...prev, page_no: 1, page_size: size }));
  const updatePageNumber = (page) =>
    setPagination((prev) => ({ ...prev, page_no: page }));

  // SORTING
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

  // Fetch library to show as select options in add risk via library option
  const [library, setLibrary] = useState([]);
  const fetchLibrary = async () => {
    const { data } = await getLibrary({ filters: {}, search: "" });
    setLibrary(data.scenarios);
  };

  // REGISTER TABLE: State to store the register table data
  const [{ risks: register }, setRegister] = useState({ risks: [] });

  const abortControllerRef = useRef(null);

  // Function to fetch register data, and set the state
  const fetchandSetRegister = async (reload, filterTrigger) => {
    const payload = {
      filters: {},
      search: {
        scenario: colsSearchRef.current?.scenario || "",
        category: colsSearchRef.current?.category || "",
        owner: colsSearchRef.current?.owners || "",
      },
      page_size: pagination.page_size,
      page_no: filterTrigger ? 1 : pagination.page_no,
      ...sorting,
    };

    if (filters.owners.length > 0) {
      payload.filters["owner"] = filters.owners;
    }
    if (filters.category.length > 0) {
      payload.filters["category"] = filters.category;
    }
    if (filters.treatment.length > 0) {
      payload.filters["treatment"] = filters.treatment;
    }
    if (filters.inherent.length > 0) {
      payload.filters["inherent_risk"] = filters.inherent;
    }
    if (filters.residual.length > 0) {
      payload.filters["residual_risk"] = filters.residual;
    }
    if (filters.ciaCategories.length > 0) {
      payload.filters["cia"] = filters.ciaCategories;
    }
    if (filters.source.length > 0) {
      payload.filters["source"] = filters.source;
    }
    if (filters.status.length > 0) {
      payload.filters["is_approved"] = filters.status;
    }
    if (filters.identified.length > 0) {
      let filterId = filters.identified[0];
      let last_n_months =
        filterId === 0 ? 3 : filterId === 1 ? 6 : filterId === 2 ? 12 : 0;

      const date_from = new Date();
      date_from.setMonth(date_from.getMonth() - last_n_months);

      let dateRange =
        last_n_months === 0
          ? [
              filterMetadata.identified[3].fromDate.toDate(),
              filterMetadata.identified[3].toDate.toDate(),
            ]
          : [date_from, new Date()];

      payload.filters["identified_date"] = [
        obj_to_yyyy_mm_dd(dateRange[0]),
        obj_to_yyyy_mm_dd(dateRange[1]),
      ];
    }
    const currPayload = JSON.stringify(payload);
    if (currPayload === prevPayload.current && !reload) {
      return;
    }
    prevPayload.current = currPayload;

    // ABORT CONTROLLER TO CONTROL REQUESTS
    // Abort previous requests if any, before firing a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Setting up abort controller to cancel current request if immediately another is fired
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    startLoading("register");
    const { data, status } = await getRegister(payload, { signal: signal });

    if (!status) {
      stopLoading("register");
      return;
    }

    let paginationData;
    paginationData = {
      page_no: data.page_no,
      page_size: data.page_size,
      total_items: data.total_items,
      total_pages: data.total_pages,
    };
    data.risks = data.risks.map((r) => ({
      ID: r.id,
      Scenario: JSON.stringify({
        id: r.scenario.id,
        description: r.scenario.scenario,
        categories_id: r.scenario.categories.map((c) => c.id),
        source_type: r.scenario.scenario_source,
        // Store both framework id and name for easier access
        applicable_framework: r.scenario.applicable_framework ?? null,
        applicable_framework_name: r.scenario.applicable_framework_name ?? null,
      }),
      "Applicable Framework Id": r.scenario.applicable_framework ?? null,
      "Applicable Framework Name": r.scenario.applicable_framework_name ?? null,
      "Applicable Framework": r.scenario.applicable_framework_name ?? null,
      Owner: r.owner,
      "Identified Date": r.identification_date
        ? new Date(r.identification_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "N/A",

      "Modified Date": r.created_at
        ? new Date(r.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "N/A",
      CIA: r.cia.map((c) => c.id),
      "Risk Id": r.risk_id,
      "Inherent Risk Likelihood Id": r.inherent_risk_likelihood,
      "Inherent Risk Impact Id": r.inherent_risk_impact,
      "Residual Risk Likelihood Id": r.residual_risk_likelihood,
      "Residual Risk Impact Id": r.residual_risk_impact,
      Notes: r.notes,
      Treatment: JSON.stringify({
        type: r.treatment,
        controls: [],
        status: r.treatment,
      }),
      Tasks: r.actions,
      Approved: r.is_approved,
      Archived: false,
      "Detected From":
        r.detected_from != null
          ? DETECTED_FROM_CHOICES.find(
              (detects) => detects.val === Number(r.detected_from)
            )?.text
          : null,
      Vendors: [],
    }));
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setRegister(data);
      resetPageState();
      setPagination({ ...paginationData });
      stopLoading("register");
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    fetchandSetRegister();
  }, [pagination, sorting]);

  const filterStringified = useRef("");
  // Whenever any filters are changed, set page to 1
  const filterTrigger = () => {
    // If filters haven't changed, return;
    if (filterStringified.current === JSON.stringify(filters)) return;
    filterStringified.current = JSON.stringify(filters);
    setPagination((prev) => ({ ...prev, page_no: 1 }));
  };

  const onSearch = (val) => {
    searchedValue.current = val;
    setPagination((prev) => ({ ...prev, page_no: 1 }));
  };

  // State to track which rows are selected
  const [selectedRow, setSelectedRow] = useState([]);

  const getCurrentIndex = () => {
    if (selectedRow.length === 0) return -1;
    return selectedRow[0];
  };

  // State for matched cell
  const [matchedCell, setMatchedCell] = useState([]);

  const changeFilters = (filterName, updatedFilterIds, identifiedDates) => {
    setFilters((prev) => {
      return {
        ...prev,
        [filterName]: updatedFilterIds,
      };
    });
    colsSearchRef.current[filterName] = "";
    if (
      filterName === "identified" &&
      updatedFilterIds[0] === 3 &&
      identifiedDates
    ) {
      setFilterMetadata({
        identified: {
          3: {
            fromDate: identifiedDates[0],
            toDate: identifiedDates[1],
          },
        },
      });
    }
  };
  const clearFilters = (filterName) => {
    if (filterName) {
      setFilters((prev) => ({
        ...prev,
        [filterName]: [],
      }));
      if (filterName === "identified") {
        setFilterMetadata({
          identified: { 3: { fromDate: null, toDate: null } },
        });
      }
    } else {
      setFilters((prev) => {
        const obj = {};
        for (const key in prev) {
          obj[key] = [];
        }
        return obj;
      });
      setFilterMetadata({
        identified: { 3: { fromDate: null, toDate: null } },
      });
    }
  };

  const colsSearchRef = useRef({});
  const handleColumnSearch = (col, searchVal) => {
    colsSearchRef.current[col] = searchVal;
    updatePageNumber(1);
    setFilters((prev) => ({
      ...prev,
      [col]: [],
    }));
  };

  // State to toggle dialog, for adding scenario manually, and editing it
  const [scenarioDialog, setScenarioDialog] = useState({
    open: false,
    isViaLibrary: false,
  });
  const closeScenarioDialog = () =>
    setScenarioDialog({ open: false, isViaLibrary: false });

  // CLICK handlers for add scenario options
  const addManualScenario = () =>
    resetPageState() & setScenarioDialog({ open: true, isViaLibrary: false });
  // reset page before trying to add new scenario
  const resetPageState = () => {
    setSelectedRow([]);
  };
  const openEditForm = () =>
    setScenarioDialog({ open: true, isViaLibrary: false });

  const onApprove = async () => {
    startLoading("backdrop");
    const row = register[getCurrentIndex()];
    const { status } = await updateRegister(row["ID"], { is_approved: true });
    stopLoading("backdrop");
    if (status) {
      notification(
        "risk-udpate-success",
        "Risk approved successfully!",
        "success"
      );
      fetchandSetRegister(true);
    }
  };

  const addScenarioViaLibrary = () => {
    resetPageState();
    setScenarioDialog({ open: true, isViaLibrary: true });
  };

  const addScenarioViaImport = () => {
    resetPageState();
    openUploadForm();
  };

  // CLICK handlers for more options
  const viewArchived = () => {
    console.log("View Archived");
  };

  const hideGuide = () => {
    console.log("Hide Guide");
  };

  const [exportDialog, setExportDialog] = useState(false);
  const openExportDialog = async () => {
    // Directly handling download without showing download dialog

    startLoading("backdrop");

    const { data, status } = await exportRisk();

    if (!status) {
      stopLoading("backdrop");
      return;
    }

    const finalData = data.map(mapRiskRows);

    // Generate XLSX sheets
    const sheetOpen = XLSX.utils.json_to_sheet(finalData);

    // Create a empty xlsx file
    const book = XLSX.utils.book_new();

    // Append sheets
    XLSX.utils.book_append_sheet(book, sheetOpen, "Register");

    // Save & download file
    XLSX.write(book, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(book, `risks.xlsx`);

    stopLoading("backdrop");

    // setExportDialog(true);
  };
  const closeExportDialog = () => setExportDialog(false);

  // CLICK handlers for share options
  const createSnapshot = () => {
    console.log("create Snapshot");
  };

  const generateAssessmentReport = () => {
    console.log("Generate Assessment Report");
  };

  const configAuditorView = () => {
    console.log("configure auditor view");
  };

  // MANAGE ADD ACTION
  const [actionDialog, setActionDialog] = useState(false);
  const closeAddActionForm = () => setActionDialog(false);

  // get options for risks
  const getRegisterOptions = () =>
    register.length !== 0
      ? register.map((row) => ({
          val: row["ID"],
          text: JSON.parse(row["Scenario"]).description,
        }))
      : [];

  const handleAddActionFormSubmit = async (values) => {
    const date = new Date(values.due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const payload = {
      risk_id: values.risk.val,
      // description: JSON.parse(register.find(row => row.ID.toString() === values.risk.toString())["Scenario"]).description,
      description: values.action,
      due_date: formattedDate,
      assignee: owners.find((owner) => owner.id.toString() === values.owner).id,
      notes: values.notes,
      task_type: "custom",
      // source_id: 1,
    };
    const res = await put("risk/tasks/", payload);
    if (res.status) {
      closeAddActionForm();
      fetchandSetRegister(true);
    }
  };

  // All column names into a state
  const [allColumns, setAllColumns] = useState(risk_register_columns);
  const [visibleColumns, setVisibleColumns] = useState(risk_register_columns);

  // Functions for hide and show columns
  const hideColumn = (col) => {
    setVisibleColumns((prev) => {
      return prev.filter((colName) => colName !== col);
    });
  };
  const showColumn = (col) => {
    // Filtering using allColumns state (bcs it is sorted). and removing cols which are not in visibleCols
    // add one more condition to accept new col
    let visibleCols = allColumns.filter(
      (colName) => visibleColumns.includes(colName) || colName === col
    );
    setVisibleColumns(visibleCols);
  };

  // Get score from a value between 0-100
  const {
    getLikelihoodScore,
    getImpactScore,
    getLikelihoodSliderValue,
    getImpactSliderValue,
  } = useSlider(scores);

  const onRegisterFormSubmit = async (val) => {
    // is new row
    if (getCurrentIndex() === -1 && !scenarioDialog.isViaLibrary) {
      // Use applicable_framework from form value directly (should be id)
      const payload = {
        scenario_description: val.scenario,
        categories_ids: val.categories.map((category) => category.id),
        likelihood_id: scores.likelihoodScores.find(
          (score) => score.score === getLikelihoodScore(val.inherent_likelihood)
        ).id,
        impact_id: scores.impactScores.find(
          (score) => score.score === getImpactScore(val.inherent_impact)
        ).id,
        notes: val.notes,
        cia: cia_categories
          .filter((cia) => Boolean(val[cia.name]))
          .map((cia) => cia.id),
        applicable_framework: val.applicable_framework ?? null,
        // Add detected_from key for new risk
        detected_from: val.detected_from ?? null,
        // Always add is_approved to payload for new risk
        is_approved: val.is_approved,
      };
      const { status } = await createRisk(payload);
      if (status) {
        closeScenarioDialog();
        notification(
          "scenario-add-success",
          "Scenario Successfully Created !",
          "success"
        );
        resetPageState();
        return fetchandSetRegister(true);
      }
    } else if (scenarioDialog.isViaLibrary) {
      // Use applicable_framework from form value directly (should be id)
      const payload = {
        scenario_id: val.scenario,
        // applicable_framework: val.applicable_framework ?? null,
        likelihood_id: scores.likelihoodScores.find(
          (score) => score.score === getLikelihoodScore(val.inherent_likelihood)
        ).id,
        impact_id: scores.impactScores.find(
          (score) => score.score === getImpactScore(val.inherent_impact)
        ).id,
        cia: cia_categories
          .filter((cia) => Boolean(val[cia.name]))
          .map((cia) => cia.id),
        notes: val.notes,
        detected_from: val.detected_from ?? null,
        is_approved: val.is_approved,
      };
      const { status } = await createRisk(payload);
      if (status) {
        closeScenarioDialog();
        notification(
          "risk-add-success",
          "Risk Successfully Created !",
          "success"
        );
        resetPageState();
        return fetchandSetRegister(true);
      }
    } else {
      // is edit row
      const payload = {};
      const row = register[getCurrentIndex()];
      const prev_scenario = row.Scenario
        ? JSON.parse(row.Scenario).description || ""
        : "";
      const prev_categories = row.Scenario
        ? (JSON.parse(row.Scenario).categories_id || []).sort()
        : [];
      const curr_scenario = val.scenario;
      const curr_categories = val.categories.map((c) => c.id).sort();

      // Always use applicable_framework from form value (should be id)
      const applicable_framework = val.applicable_framework ?? null;

      if (val.source === 0) {
        if (
          prev_scenario === curr_scenario &&
          JSON.stringify(prev_categories) === JSON.stringify(curr_categories)
        ) {
        } else {
          payload.scenario_description = val.scenario;
          payload.categories_ids = val.categories.map(
            (category) => category.id
          );
        }
      } else {
        if (prev_scenario !== curr_scenario) {
          payload.scenario_description = val.scenario;
        }
        if (
          JSON.stringify(prev_categories) !== JSON.stringify(curr_categories)
        ) {
          payload.categories_ids = val.categories.map(
            (category) => category.id
          );
        }
      }

      if (val.owner !== row.Owner) {
        payload.owner = val.owner;
      }
      if (val.notes !== row.Notes) {
        payload.notes = val.notes;
      }
      if (val.identified_date !== row["Identified Date"]) {
        payload.identified_date =
          typeof val.identified_date === "string"
            ? val.identified_date
            : val.identified_date.toDate().toISOString();
      }
      if (val.modified_date !== row["Modified Date"]) {
        payload.modified_date =
          typeof val.modified_date === "string"
            ? val.modified_date
            : val.modified_date.toDate().toISOString();
      }

      const cia = [];
      if (val.uncategorized) {
        cia.push(1);
      }
      if (val.confidentiality) {
        cia.push(2);
      }
      if (val.availability) {
        cia.push(3);
      }
      if (val.integrity) {
        cia.push(4);
      }
      if (JSON.stringify(cia) !== JSON.stringify(row.CIA)) {
        payload.cia = cia;
      }

      const il = scores.likelihoodScores.find(
        (score) => score.score === getLikelihoodScore(val.inherent_likelihood)
      ).id;
      if (il !== row["Inherent Risk Likelihood Id"]) {
        payload.inherent_risk_likelihood_id = il;
      }
      const ii = scores.impactScores.find(
        (score) => score.score === getImpactScore(val.inherent_impact)
      ).id;
      if (ii !== row["Inherent Risk Impact Id"]) {
        payload.inherent_risk_impact_id = ii;
      }

      const rl =
        val.residual_likelihood === null
          ? null
          : scores.likelihoodScores.find(
              (score) =>
                score.score === getLikelihoodScore(val.residual_likelihood)
            ).id;
      if (rl !== row["Residual Risk Likelihood Id"]) {
        payload.residual_risk_likelihood_id = rl;
      }
      const ri =
        val.residual_impact === null
          ? null
          : scores.impactScores.find(
              (score) => score.score === getImpactScore(val.residual_impact)
            ).id;
      if (ri !== row["Residual Risk Impact Id"]) {
        payload.residual_risk_impact_id = ri;
      }

      if (
        val.treatment_plan !==
        (row["Treatment"] ? JSON.parse(row["Treatment"]).type || -1 : -1)
      ) {
        payload.treatment = TREATMENT_NAME_ID_MAP[val.treatment_plan];
      }

      // Always include applicable_framework in edit payload
      payload.applicable_framework = applicable_framework;

      // Always include detected_from in edit payload
      payload.detected_from = val.detected_from ?? null;

      // If scenario_id is provided from the dialog payload, and detected_from is set, use it
      if (val.detected_from != null && val.scenario_id) {
        payload.scenario_id = val.scenario_id;
      }

      payload.is_approved = val.is_approved;

      if (Object.keys(payload).length > 0) {
        const { status } = await updateRegister(row["ID"], payload);
        if (status) {
          closeScenarioDialog();
          notification(
            "risk-udpate-success",
            "Risk Successfully Updated !",
            "success"
          );
          resetPageState();
          return fetchandSetRegister(true);
        }
      } else {
        notification("risk-udpate-success", "No fields modified!", "error");
      }
    }
  };

  // state to open upload csv dialog
  const [uploadCsv, setUploadCsv] = useState(false);
  const openUploadForm = () => setUploadCsv(true);
  const closeUploadForm = () => setUploadCsv(false);

  const handleImport = async (file) => {
    startLoading("register");
    const { status } = await importRisk(file);
    closeUploadForm();
    stopLoading("register");
    if (status) return fetchandSetRegister(true);
  };

  const mapRiskRows = (row) => {
    let mappedRow = {};
    Object.keys(row).map((key) => {
      if (key === "scenario")
        mappedRow["scenario"] = row["scenario"]["scenario"];
      else if (key === "cia")
        mappedRow["cia"] = row["cia"].map((cia) => cia.name).join(", ");
      else if (key === "owner")
        mappedRow[
          "owner"
        ] = `${row["owner"]["first_name"]} ${row["owner"]["last_name"]}`;
      // Add applicable framework id and name to export
      else if (key === "Applicable Framework Id")
        mappedRow["applicable_framework_id"] = row["Applicable Framework Id"];
      else if (key === "Applicable Framework Name")
        mappedRow["applicable_framework_name"] =
          row["Applicable Framework Name"];
      else mappedRow[key] = row[key];
    });
    return mappedRow;
  };

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(visibleColumns, sorting, updateSort);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      register,
      visibleColumns,
      selectedRow,
      matchedCell,
      categories,
      owners,
      scores
      // sortingMap
    );

  // Get classes from useStyle, which is in RiskRegisterUtils
  const classes = useStyle();

  return (
    <Box>
      <Box className={classes.registerContainer}>
        <RiskRegisterHeader
          // Global disable
          contextLoading={isContextLoading}
          // Dropdown options click handlers
          addScenarioOptionsHandlers={{
            addManualScenario,
            addScenarioViaLibrary,
            addScenarioViaImport,
          }}
          moreOptionsHandlers={{ viewArchived, hideGuide, openExportDialog }}
          shareOptionsHandlers={{
            createSnapshot,
            generateAssessmentReport,
            configAuditorView,
          }}
          // Dropdown data for filters
          tableFilters={filterDropdowns}
          // activeFilters to set checked, and setFilters to handle changes
          activeFilters={filters}
          changeFilters={changeFilters}
          clearFilters={clearFilters}
          triggerFilters={filterTrigger}
          filterMetadata={filterMetadata}
          // Selected rows
          selectedRows={selectedRow}
          // Edit button click handler
          editHandler={openEditForm}
          approveHandler={onApprove}
          cols={{ allColumns, visibleColumns, hideColumn, showColumn }}
          // open add action form
          openAddActionForm={() => setActionDialog(true)}
          onSearch={onSearch}
          row={register[getCurrentIndex()]}
        />

        {isLoading("register") ? (
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
                selectedRows={selectedRow}
                setSelectedRows={setSelectedRow}
                headerWrapper={(text) => <HeaderCell text={text} />}
                // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
                style={{
                  borderRadius: 5,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                minCellWidth={visibleColumns.map(
                  (name) =>
                    risk_register_columns_width[allColumns.indexOf(name)]
                )}
                // Filters
                columnFilters={filterDropdowns}
                activeFilters={filters}
                changeFilters={(
                  filterName,
                  updatedFilterIds,
                  identifiedDates
                ) => {
                  changeFilters(filterName, updatedFilterIds, identifiedDates);
                  setTimeout(() => filterTrigger(), 0);
                }}
                clearFilters={clearFilters}
                handleColumnSearch={handleColumnSearch}
                activeColumnsSearched={colsSearchRef.current}
                // Pagination props
                currentPage={pagination.page_no}
                pageSize={pagination.page_size}
                totalItems={pagination.total_items}
                updatePageSize={updatePageSize}
                updatePageNumber={updatePageNumber}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      {scenarioDialog.open && (
        <RiskFormDialog
          hasAccess={hasEditRiskAccess}
          open={scenarioDialog.open}
          closeHandler={closeScenarioDialog}
          rowIndex={getCurrentIndex()}
          row={register[getCurrentIndex()]}
          viaLibrary={scenarioDialog.isViaLibrary}
          library={library}
          autocompleteOptions={{
            categories,
            owners: filterDropdowns.owners.options,
          }}
          getSliderValue={{ getLikelihoodSliderValue, getImpactSliderValue }}
          scores={scores}
          onFormSubmit={onRegisterFormSubmit}
        />
      )}

      {actionDialog && (
        <AddActionDialog
          hasAccess={hasEditActionAccess}
          open={actionDialog}
          closeHandler={closeAddActionForm}
          risks={getRegisterOptions()}
          owners={owners.map((owner) => ({
            val: owner.id,
            text: `${owner.first_name} ${owner.last_name}`,
          }))}
          isCreateAction={true}
          riskVal={register[getCurrentIndex()]}
          onFormSubmit={handleAddActionFormSubmit}
        />
      )}

      <UploadFileDialog
        open={uploadCsv}
        onClose={closeUploadForm}
        onImport={handleImport}
        requiredColumns={REQUIRED_COLUMNS}
        optionalColumns={OPTIONAL_COLUMNS}
        col_TooltipDesc_Map={COL_TOOLTIP_MAP}
        getPlainFile={true}
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
        dialogTitle="Export All Risks"
        close={closeExportDialog}
        allColumns={[]}
        hiddenColumns={[]}
        dataFetcher={exportRisk}
        dataMapper={mapRiskRows}
      />
    </Box>
  );
};

export default RiskRegister;
