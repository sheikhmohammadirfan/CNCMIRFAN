import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Icon,
  makeStyles,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import AssessmentTabs from "./AssessmentTabs";
import TabPanel from "../TabPanel";
import Active from "./Active";
import Archived from "./Archived";
import AssessmentTable from "./AssessmentTable";
import AssessmentFilters from "../../../assets/data/VendorManagement/VendorAssessment/AssessmentFilters";
import { assessment_columns } from "../../../assets/data/VendorManagement/VendorAssessment/AssessmentColumns";
import AddVendorForm from "./AddVendorForm";
import UploadFileDialog from "../../Utils/UploadFileDialog";
import XLSX from "xlsx";
import useParams from "../../Utils/Hooks/useParams";
import { COLUMN_DESCRIPTION_MAP, REQUIRED_COLUMNS, OPTIONAL_COLUMNS } from "../../../assets/data/VendorManagement/VendorAssessment/ImportCols";
import { createSecurityReview, createVendor, deleteVendor, updateVendor } from "../../../Service/VendorManagement/VendorManagement.service.jsx";
import { getUser } from "../../../Service/UserFactory.jsx";

const useStyles = makeStyles({
  button: {
    textTransform: "none",
  },
  backdrop: {
    zIndex: 1000000,
    display: "flex",
    flexDirection: "column",
    color: "white",
    "&  .backdrop-label": {
      marginTop: 10,
      fontWeight: "bold",
      letterSpacing: 1,
      fontStyle: "italic",
    },
  }
});

const VendorAssessment = ({ isLoading, vendorList, securityReviewList, ownersList, reload }) => {
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
  const [showLoader, updateLoader] = useState(false);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedRows([]); // Reset selected rows when changing tabs
  };

  useEffect(() => {
    if (!isLoading()) {
      (async () => {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
        };
        const ownersLookup = {};
        ownersList.forEach((owner) => {
          ownersLookup[owner.email] = `${owner.first_name} ${owner.last_name}`;
        });
        const activeVendors = vendorList
                            .filter((vendor) => vendor.managed === true && vendor.archived === false)
                            .map(vendor => {
                              const res = vendor;
                              const review = securityReviewList.find(s => s.vendor === res.id);
                              if (review) {
                                res.review = {
                                  due_date: formatDate(review.last_review_date),
                                  status: review.review_status_reason,
                                };
                                res.last_date = formatDate(review.last_review_date);
                                res.owner = ownersLookup[review.security_owner];
                              } else {
                                  res.review = {
                                    status: "Not Required"
                                  }
                                  res.last_date = "—";
                                  res.owner = "Owner unassigned";
                              }
                              return res;
                            });
        setActiveRows(activeVendors);
        const archivedVendors = vendorList
                            .filter((vendor) => vendor.archived === true && vendor.managed === true)
                            .map(vendor => {
                              const res = vendor;
                              const review = securityReviewList.find(s => s.vendor === res.id);
                              if (review) {
                                res.review = {
                                  due_date: review.last_review_date,
                                  status: review.review_status_reason,
                                };
                                res.last_date = review.last_review_date;
                                res.owner = review.security_owner;
                              }
                              return res;
                            });
        setArchivedRows(archivedVendors);
      })();
    }
  }, [vendorList, isLoading]);

  const [filterDropdowns, setFilterDropdowns] = useState(AssessmentFilters);
  
  const extractUniqueValues = (rows, key) => {
    const uniqueValues = [...new Set(rows.map(row => row[key]))];
    return uniqueValues.map((value, index) => ({ id: index, text: value }));
  };

  const updateFilterDropdowns = (rows) => {
    const uniqueOwners = extractUniqueValues(rows, "owner");

    // Remove specific options if they exist in the dynamic data
    const filteredUniqueOwners = uniqueOwners.filter(owner => 
      owner.text !== "Owned by me" && 
      owner.text !== "Owner unassigned" && 
      owner.text !== "Owner offboarded"
    );

    setFilterDropdowns((prev) => ({
      ...prev,
      category: {
        name: "category",
        text: "Category",
        order: 1,
        options: extractUniqueValues(rows, "category"),
      },
      securityOwner: {
        name: "owner",
        text: "Security owner",
        order: 3,
        options: [
          { id: 0, text: "Owned by me" },
          { id: 1, text: "Owner unassigned" },
          { id: 2, text: "Owner offboarded" },
          ...filteredUniqueOwners,
        ],
      },
    }));
  }; 

  useEffect(() => {
    if (activeTab === 0) {
      updateFilterDropdowns(activeRows);
    } else {
      updateFilterDropdowns(archivedRows);
    }
  }, [activeRows, archivedRows, activeTab]);

  const [filters, setFilters] = useState({
    category: params.category ? params.category.split(",") : [],
    risk: params.risk ? params.risk.split(",") : [],
    owner: [],
    data: [],
    review: [],
    date: [],
  });

  const [filterMetadata, setFilterMetadata] = useState({
    date: {
      3: {
        fromDate: null,
        toDate: null,
      },
    },
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
    if (params.date_fromDate && params.date_toDate) {
      setFilterMetadata((prev) => ({
        ...prev,
        date: {
          3: {
            fromDate: new Date(params.date_fromDate),
            toDate: new Date(params.date_toDate),
          },
        },
      }));
      setFilters((prev) => ({
        ...prev,
        date: ["Custom"],
      }));
    }
  }, [params.risk, params.category, params.date_fromDate, params.date_toDate]);

  const changeFilters = (filterName, itemText, dateInput) => {
    const updatedFilterIds = filters[filterName].includes(itemText)
      ? filters[filterName].filter((text) => text !== itemText)
      : [...filters[filterName], itemText];

    setFilters((prev) => ({
      ...prev,
      [filterName]: updatedFilterIds,
    }));

    if (filterName === "date" && updatedFilterIds.includes("Custom")) {
      if (dateInput && dateInput[0] && dateInput[1]) {
        setFilterMetadata((prev) => ({
          ...prev,
          date: {
            3: {
              fromDate: dateInput[0],
              toDate: dateInput[1],
            },
          },
        }));
  
        changeParams({
          [`${filterName}_fromDate`]: dateInput[0].toISOString(),
          [`${filterName}_toDate`]: dateInput[1].toISOString(),
        });
      }
    } else {
      deleteParams(`${filterName}_fromDate`);
      deleteParams(`${filterName}_toDate`);
    }

    if (updatedFilterIds.length === 0) {
      deleteParams(filterName);
    } else {
      changeParams({ [filterName]: updatedFilterIds.join(",") });
    }
  };

  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
  
    if (filterName === "date") {
      setFilterMetadata((prev) => ({
        ...prev,
        date: {
          3: {
            fromDate: null,
            toDate: null,
          },
        },
      }));
      deleteParams(`${filterName}_fromDate`);
      deleteParams(`${filterName}_toDate`);
    }
  
    deleteParams(filterName);
  };

  const filterRows = (rows, searchValue, filters) => {
    const filterMapping = {
      category: "category",
      risk: "inherent_risk",
      owner: "owner",
      review: "review.status",
      date: "review.due_date",
    };

    return rows.filter((row) => {
      const matchesSearch = searchValue
        ? row.vendor_name.toLowerCase().includes(searchValue.toLowerCase())
        : true;

      const matchesFilters = Object.keys(filters).every((filterName) => {
        const activeFilterValues = filters[filterName];
        if (activeFilterValues.length === 0) {
          return true;
        }

        if (filterName === "date") {
          const currentDate = new Date();
          const reviewDueDate = new Date(row.review.due_date);
  
          switch (activeFilterValues[0]) {
            case "This year":
              return reviewDueDate.getFullYear() === currentDate.getFullYear();
            case "This quarter":
              const currentQuarter = Math.floor(currentDate.getMonth() / 3);
              const reviewQuarter = Math.floor(reviewDueDate.getMonth() / 3);
              return reviewDueDate.getFullYear() === currentDate.getFullYear() && reviewQuarter === currentQuarter;
            case "This month":
              return reviewDueDate.getFullYear() === currentDate.getFullYear() && reviewDueDate.getMonth() === currentDate.getMonth();
            case "Custom":
              const fromDate = filterMetadata.date[3].fromDate;
              const toDate = filterMetadata.date[3].toDate;
              return reviewDueDate >= fromDate && reviewDueDate <= toDate;
            default:
              return true;
          }
        }

        const rowField = filterMapping[filterName];
        const fieldPath = rowField.split('.');
        const fieldValue = fieldPath.reduce((acc, field) => acc && acc[field], row);
        return activeFilterValues.includes(fieldValue);
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

  const actionButton = async (target) => {
    updateLoader(true);
    const list = getFilteredRowsForActiveTab();
    const row = list.find((_,idx) => idx === selectedRows[0]);
    let res;
    if (target === 0) {
      res = await updateVendor(row.id, { archived: false, organization: getUser().organization_id });
    } else if (target === 1) {
      res = await updateVendor(row.id, { archived: true, organization: getUser().organization_id });
    } else if (target === 2) {
      res = await deleteVendor(row.id);
    }
    updateLoader(false);
    if (res.status) {
      setSelectedRows([]);
      reload();
    }
  }

  const ArchiveButton = {
    label: "Archive",
    onClick: () => actionButton(1),
    disabled: selectedRows.length !== 1,
  };

  const DeleteButton = {
    label: "Delete",
    onClick: () => actionButton(2),
    disabled: selectedRows.length !== 1,
  };

  const UnarchiveButton = {
    label: "Unarchive",
    onClick: () => actionButton(0),
    disabled: selectedRows.length !== 1,
  };

  const activeButtons = [ ArchiveButton, DeleteButton ];
  const archivedButtons = [ UnarchiveButton, DeleteButton ];

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
        "Vendor Name": row?.vendor_name || "",
        Category: row?.category || "",
        "Inherent Risk": row?.inherent_risk || "",
        "Security Review Status": row.review?.status || "",
        "Security Review Due Date": row.review?.due_date || "",
        "Security Owner": row?.review || "",
        "Last Reviewed": row?.last_date || "",
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
  const handleAddVendor = async (vendor) => {
    updateLoader(true);
    const { status } = await createVendor(vendor);
    updateLoader(false);
    if (status) {
      reload();
    }
    return status;
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

  const handleImport = async (rows) => {
    const formattedRows = rows.map((row) => ({
      vendor_name: row["Vendor Name"] || "Unknown",
      category: row.Category || "Unknown",
      inherent_risk: row["Inherent Risk"] || "Unknown",
      website: row.Website || "Unknown",
      source: row.Source || "Unknown",
      number_of_accounts: row["Number of Accounts"] || 0,
      date_discovered: new Date(),
      managed: true,
      auth_method: "SSO"
    }));
  
    updateLoader(true);
    for (const vendor of formattedRows) {
      try {
        const vendorRes = await createVendor(vendor);
        if (vendorRes.status) {
          const reviewDate = new Date();
          reviewDate.setDate(reviewDate.getDate());
          const payload = {
            vendor: vendorRes.data.id,
            security_owner: getUser().id,
            review_status: false,
            review_status_reason: "Need Review",
            last_review_date: reviewDate.toISOString(),
          };
          const reviewRes = await createSecurityReview(payload);
          if (reviewRes.status) {
            await updateVendor(vendorRes.data.id, { managed: true, archived: false, organization: getUser().organization_id });
          }
        }
      } catch (error) {
        console.error("Error creating vendor or security review: ", vendor, error);
      }
    }
    updateLoader(false);
    reload();
  };

  const categories = AssessmentFilters.category.options.map(
    (option) => option.text
  );
  const sources = ["Microsoft 365", "Gmail", "Zoho"];
  const riskLevels = AssessmentFilters.risk.options
    .filter(option => option.text !== "Unknown")
    .map(option => option.text);
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
        requiredColumns={REQUIRED_COLUMNS}
        optionalColumns={OPTIONAL_COLUMNS}
        col_TooltipDesc_Map={COLUMN_DESCRIPTION_MAP}
      />

      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="inherit" />
        <Typography className="backdrop-label" variant="h5">
          Please wait...
        </Typography>
      </Backdrop>
    </Box>
  );
};

export default VendorAssessment;
