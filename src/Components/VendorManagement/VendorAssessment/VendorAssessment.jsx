import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Icon,
  makeStyles,
} from "@material-ui/core";
import AssessmentTabs from "./AssessmentTabs";
import TabPanel from "../TabPanel";
import Active from "./Active";
import Archived from "./Archived";
import AssessmentTable from "./AssessmentTable";
import AssessmentFilters from "../../../assets/data/VendorManagement/VendorAssessment/AssessmentFilters";
import { assessment_columns } from "../../../assets/data/VendorManagement/VendorAssessment/AssessmentColumns";
import AddVendorForm from "./AddVendorForm";
import UploadFileDialog from "./UploadFileDialog";
import XLSX from "xlsx";
import useParams from "../../Utils/Hooks/useParams";
import { createVendor, deleteVendor } from "../../../Service/VendorManagement/VendorManagement.service.jsx";
const useStyles = makeStyles({
  button: {
    textTransform: "none",
  },
});

const VendorAssessment = ({ isLoading, vendorList }) => {
  const classes = useStyles();
  const [matchedCell, setMatchedCell] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const { params, changeParams, deleteParams } = useParams("risk", "category");
  const [activeRows, setActiveRows] = useState([]);
  const [archivedRows, setArchivedRows] = useState([]);

  const managedVendors = vendorList.filter((vendor) => vendor.managed === true);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedRows([]); // Reset selected rows when changing tabs
  };

  useEffect(() => {
    if (!isLoading()) {
      (async () => {
        setActiveRows(managedVendors);
        setArchivedRows(managedVendors);
      })();
    }
  }, [isLoading]);

  const [filterDropdowns, setFilterDropdowns] = useState(AssessmentFilters);
  const [filters, setFilters] = useState({
    category: params.category ? params.category.split(",") : [],
    risk: params.risk ? params.risk.split(",") : [],
    owner: [],
    data: [],
    review: [],
    date: [],
  });

  // Update filters when URL params change
  useEffect(() => {
    if (params.risk) {
      setFilters((prev) => ({
        ...prev,
        risk: params.risk.split(","),
      }));
    }
    if (params.category) {
      setFilters((prev) => ({
        ...prev,
        category: params.category.split(","),
      }));
    }
  }, [params.risk, params.category]);

  const changeFilters = (filterName, itemText) => {
    const updatedFilterTexts = filters[filterName].includes(itemText)
      ? filters[filterName].filter((text) => text !== itemText)
      : [...filters[filterName], itemText];

    setFilters((prev) => ({
      ...prev,
      [filterName]: updatedFilterTexts,
    }));

    if (updatedFilterTexts.length === 0) {
      deleteParams(filterName);
    } else {
      changeParams({ [filterName]: updatedFilterTexts.join(",") });
    }
  };

  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
    deleteParams(filterName);
  };

  const filterRows = (rows, searchValue, filters) => {
    return rows.filter((row) => {
      const matchesSearch = searchValue
        ? row.vendor_name.toLowerCase().includes(searchValue.toLowerCase())
        : true;

      const matchesFilters = Object.keys(filters).every((filterName) => {
        const activeFilterValues = filters[filterName];
        if (activeFilterValues.length === 0) {
          return true;
        }
        return (
          activeFilterValues.includes(row.security_owner) ||
          activeFilterValues.includes(row.review_status) ||
          activeFilterValues.includes(row.category) ||
          activeFilterValues.includes(row.source) ||
          activeFilterValues.includes(row.inherent_risk)
        );
      });

      return matchesSearch && matchesFilters;
    });
  };

  const getFilteredRowsForActiveTab = () => {
    switch (activeTab) {
      case 0:
        return filterRows(activeRows, searchValue, filters);
      case 1:
        return filterRows(archivedRows, searchValue, filters);
      default:
        return filterRows(activeRows, searchValue, filters);
    }
  };
  const filteredRows = getFilteredRowsForActiveTab();

  const [allColumns, setAllColumns] = useState(assessment_columns);
  const [visibleColumns, setVisibleColumns] = useState(assessment_columns);

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

  // Functions to move rows between tabs
  const moveRow = (rows, targetTab) => {
    // Copy the selected rows from the active tab then delete it
    let copyRows = [];
    if (activeTab === 0) {
      rows.forEach((row) => {
        copyRows.push(activeRows[row]);
      });
      setActiveRows(activeRows.filter((_, index) => !rows.includes(index)));
    }
    if (activeTab === 1) {
      rows.forEach((row) => {
        copyRows.push(archivedRows[row]);
      });
      setArchivedRows(archivedRows.filter((_, index) => !rows.includes(index)));
    }

    // Add the copied rows from the active tab to the target tab
    if (targetTab === 0) {
      copyRows.forEach((row) => {
        setActiveRows((prev) => [...prev, row]);
      });
    }
    if (targetTab === 1) {
      copyRows.forEach((row) => {
        setArchivedRows((prev) => [...prev, row]);
      });
    }
    copyRows = [];
  };

  const deleteRow = (rows) => {
    if (activeTab === 0) {
      setActiveRows(activeRows.filter((_, index) => !rows.includes(index)));
    }
    if (activeTab === 1) {
      setArchivedRows(archivedRows.filter((_, index) => !rows.includes(index)));
    }
  };

  const activeButtons = [
    {
      label: "Archive",
      onClick: () => {
        moveRow(selectedRows, 1);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Delete",
      onClick: () => {
        selectedRows.forEach((rowIndex) => deleteVendor(activeRows[rowIndex].id))
        deleteRow(selectedRows);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
  ];

  const archivedButtons = [
    {
      label: "Unarchive",
      onClick: () => {
        moveRow(selectedRows, 0);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Delete",
      onClick: () => {
        moveRow(selectedRows);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
  ];

  let headerButtons = [];
  switch (activeTab) {
    case 0:
      headerButtons = activeButtons;
      break;
    case 1:
      headerButtons = archivedButtons;
      break;
    default:
      headerButtons = activeButtons;
  }

  const vendorExport = (activeData, archivedData) => {
    const mapData = (data) => {
      return data.map((row) => ({
        "Vendor Name": row["NAME / CATEGORY"].name,
        Category: row["NAME / CATEGORY"].category,
        "Inherent Risk": row["INHERENT RISK"],
        "Security Review Status": row["SECURITY REVIEW"].status,
        "Security Review Due Date": row["SECURITY REVIEW"].due_date,
        "Security Owner": row["SECURITY OWNER"],
        "Last Reviewed": row["LAST REVIEWED"],
      }));
    };

    const mappedActiveData = mapData(activeData);
    const mappedArchivedData = mapData(archivedData);

    const activeWorksheet = XLSX.utils.json_to_sheet(mappedActiveData);
    const archivedWorksheet = XLSX.utils.json_to_sheet(mappedArchivedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, activeWorksheet, "Active Vendors");
    XLSX.utils.book_append_sheet(
      workbook,
      archivedWorksheet,
      "Archived Vendors"
    );

    XLSX.writeFile(workbook, "vendors.xlsx");
  };

  const handleAddVendorClick = () => setShowAddVendor(true);
  const handleCloseAddVendor = () => setShowAddVendor(false);
  const handleAddVendor = (vendor) => {
    const vendorData = {
      vendor_name: "Vendor1",
      category: "Category1", 
      source: "OKTA",
      inherent_risk: "Low",
      number_of_accounts: 10,
      date_discovered: "2024-01-01T00:00:00Z",
      website: "http://vendor1.com",
      auth_method: "SSO",
      linked_apps: null,
      managed: false,
    };
    console.log("vendordata", vendorData)
    console.log("vendor", vendor)
    createVendor(vendor)
      .then((response) => {
        console.log("created vendorresponse", response);
      })
      .catch((error) => console.error("Error: ", error));
  };

  const handleImportClick = () => {
    setShowUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setShowUploadFile(false);
  };

  const handleExportClick = () => {
    vendorExport(activeRows, archivedRows);
  };

  const handleImport = (rows) => {
    console.log("rows", ...rows);
    const formattedRows = rows.map((row, index) => ({
      id: activeRows.length + index + 1,
      "NAME / CATEGORY": {
        name: row["Vendor Name"] || "Unknown",
        category: row.Category || "Unknown",
      },
      "INHERENT RISK": row["Inherent Risk"] || "Unknown",
      "SECURITY OWNER": row["Security Owner"] || "Owner Unassigned",
      "LAST REVIEWED": row["Last Reviewed"],
      "SECURITY REVIEW": {
        due_date: row["Security Review Due Date"],
        status: row["Security Review Status"],
      },
    }));
    console.log("formatted", ...formattedRows);
    console.log("activerows", activeRows);
    setActiveRows((prev) => [...prev, ...formattedRows]);
  };

  const categories = AssessmentFilters.category.options.map(
    (option) => option.text
  );
  const sources = ["Microsoft 365", "Gmail", "Zoho"];
  const riskLevels = AssessmentFilters.risk.options.map(
    (option) => option.text
  );
  const owners = AssessmentFilters.securityOwner.options.map(
    (option) => option.text
  );

  return (
    <Box>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4">Vendor Assessment</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          width="450px"
          height="40px"
        >
          <Button
            variant="contained"
            onClick={handleAddVendorClick}
            startIcon={<Icon>add</Icon>}
            color="primary"
            className={classes.button}
          >
            Add vendor
          </Button>
          <Button
            variant="outlined"
            onClick={handleImportClick}
            startIcon={<Icon>uploadFile</Icon>}
            color="primary"
            className={classes.button}
          >
            Upload file
          </Button>
          <Button
            variant="outlined"
            onClick={handleExportClick}
            startIcon={<Icon>file_download</Icon>}
            color="primary"
            className={classes.button}
          >
            Download data
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box ml={4} mt={2}>
        <AssessmentTabs activeTab={activeTab} handleChange={handleChange} />
        <TabPanel activeTab={activeTab} index={0}>
          <Active />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={1}>
          <Archived />
        </TabPanel>
      </Box>
      <AssessmentTable
        isLoading={isLoading}
        filterDropdowns={filterDropdowns}
        filters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filteredRows={filteredRows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        allColumns={allColumns}
        visibleColumns={visibleColumns}
        hideColumn={hideColumn}
        showColumn={showColumn}
        matchedCell={matchedCell}
        headerButtons={headerButtons}
      />
      <AddVendorForm
        open={showAddVendor}
        onClose={handleCloseAddVendor}
        onSubmit={handleAddVendor}
        categories={categories}
        sources={sources}
        riskLevels={riskLevels}
        owners={owners}
      />
      <UploadFileDialog
        open={showUploadFile}
        onClose={handleCloseUploadFile}
        onImport={handleImport}
      />
    </Box>
  );
};

export default VendorAssessment;
