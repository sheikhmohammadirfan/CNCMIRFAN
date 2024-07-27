import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import DiscoveryTabs from "./DiscoveryTabs";
import TabPanel from "../TabPanel";
import NeedsReview from "./NeedsReview";
import Rejected from "./Rejected";
import Ignored from "./Ignored";
import DiscoveryTable from "./DiscoveryTable";
import DiscoveryFilters from "../../../assets/data/VendorManagement/Discovery/DiscoveryFilters";
import { discovery_columns } from "../../../assets/data/VendorManagement/Discovery/DiscoveryColumns";
import useParams from "../../Utils/Hooks/useParams";
import { getUser } from "../../../Service/UserFactory";
import { createSecurityReview, updateVendor } from "../../../Service/VendorManagement/VendorManagement.service";

const useStyles = makeStyles(theme => ({
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
  }
}));

const Discovery = ({ isLoading, vendorList, reload }) => {
  const classes = useStyles();

  const [showLoader, updateLoader] = useState(false);

  const { params, changeParams, deleteParams } = useParams(
    "risk",
    "searchValue"
  );
  const [needsReviewRows, setNeedsReviewRows] = useState([]);
  const [ignoredRows, setIgnoredRows] = useState([]);
  const [rejectedRows, setRejectedRows] = useState([]);
  const [matchedCell, setMatchedCell] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState(params.searchValue || "");
  const [activeTab, setActiveTab] = useState(0);


  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedRows([]); // Reset selected rows when changing tabs
  };

  useEffect(() => {
    if (!isLoading()) {
      (async () => {
        const unmanagedVendors = vendorList.filter(
          (vendor) => vendor.managed === false
        );
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
        };
        const formattedUnmanagedVendors = unmanagedVendors.map((vendor) => ({
          ...vendor,
          date_discovered: formatDate(vendor.date_discovered),
        }));
        console.log(formattedUnmanagedVendors)
        setNeedsReviewRows(formattedUnmanagedVendors.filter(v => v.unmanaged_location === "Review"));
        setIgnoredRows(formattedUnmanagedVendors.filter(v => v.unmanaged_location === "Ignored"));
        setRejectedRows(formattedUnmanagedVendors.filter(v => v.unmanaged_location === "Rejected"));
      })();
    }
  }, [vendorList, isLoading]);

  const [filterDropdowns, setFilterDropdowns] = useState(DiscoveryFilters);

  const extractUniqueValues = (rows, key) => {
    const uniqueValues = [...new Set(rows.map(row => row[key]))];
    return uniqueValues.map((value, index) => ({ id: index, text: value }));
  };

  const updateFilterDropdowns = (rows) => {
    setFilterDropdowns((prev) => ({
      ...prev,
      source: {
        name: "source",
        text: "Source",
        order: 1,
        options: extractUniqueValues(rows, "source"),
      },
    }));
  }; 

  useEffect(() => {
    updateFilterDropdowns(getFilteredRowsForActiveTab());
  }, [needsReviewRows, ignoredRows, rejectedRows, activeTab]);

  const [filters, setFilters] = useState({
    source: [],
    risk: params.risk ? params.risk.split(",") : [],
    date: [],
    accounts: [],
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
  }, [params.risk, params.date_fromDate, params.date_toDate]);

  useEffect(() => {
    if (params.searchValue) {
      setSearchValue(params.searchValue);
    }
  }, [params.searchValue]);

  const changeFilters = (filterName, itemValue, dateInput) => {
    const updatedFilterTexts = filters[filterName].includes(itemValue)
        ? filters[filterName].filter((text) => text !== itemValue)
        : [...filters[filterName], itemValue];

    setFilters((prev) => ({
      ...prev,
      [filterName]: updatedFilterTexts,
    }));

    if (filterName === "date" && updatedFilterTexts.includes("Custom")) {
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
    
    if (filterName === "accounts") {
      const newArray = Array.from({ length: itemValue }, (_, i) => i + 1);
      setFilters((prev) => ({
        ...prev,
        [filterName]: newArray,
      }));
      if (itemValue === 0) {
        deleteParams(filterName);
      } else {
        changeParams({ [filterName]: newArray.length });
      }
    } else {
      const updatedFilterTexts = filters[filterName].includes(itemValue)
        ? filters[filterName].filter((text) => text !== itemValue)
        : [...filters[filterName], itemValue];

      setFilters((prev) => ({
        ...prev,
        [filterName]: updatedFilterTexts,
      }));
      
      if (updatedFilterTexts.length === 0) {
        deleteParams(filterName);
      } else {
        changeParams({ [filterName]: updatedFilterTexts.join(",") });
      }
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

  const updateSearchValue = (newValue) => {
    setSearchValue(newValue);
    if (newValue) {
      changeParams({ searchValue: newValue });
    } else {
      deleteParams("searchValue");
    }
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
        if (filterName === 'date') {
          const currentDate = new Date();
          const reviewDueDate = new Date(row.date_discovered);
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

        if (filterName === "accounts") {
          return row.number_of_accounts >= activeFilterValues.length;
        }
  
        if (filterName === "risk") {
          return activeFilterValues.includes(row.inherent_risk);
        }
  
        if (filterName === "source") {
          return activeFilterValues.includes(row.source);
        }
  
        return activeFilterValues.includes(row[filterName]);
      });

      return matchesSearch && matchesFilters;
    });
  };

  const getFilteredRowsForActiveTab = () => {
    switch (activeTab) {
      case 0:
        return filterRows(needsReviewRows, searchValue, filters);
      case 1:
        return filterRows(ignoredRows, searchValue, filters);
      case 2:
        return filterRows(rejectedRows, searchValue, filters);
      default:
        return filterRows(needsReviewRows, searchValue, filters);
    }
  };

  const filteredRows = getFilteredRowsForActiveTab();

  const [allColumns, setAllColumns] = useState(discovery_columns);
  const [visibleColumns, setVisibleColumns] = useState(discovery_columns);

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
  const moveRow = async (rows, targetTab) => {
    // Add the copied rows from the active tab to the target tab
    updateLoader(true);
    const list = getFilteredRowsForActiveTab();
    const row = list.find((_,idx) => idx === rows[0]);
    if (targetTab === 1) {
      const res = await updateVendor(row.id, { unmanaged_location: "Ignored", organization: getUser().organization_id });
      updateLoader(false);
      if (res.status) {
          reload();
          return;
      }
    } else if (targetTab === 2) {
      const res = await updateVendor(row.id, { unmanaged_location: "Rejected", organization: getUser().organization_id });
      updateLoader(false);
      if (res.status) {
          reload();
          return;
      }
    } else if (targetTab === 3) {
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + 15);
      const payload = {
        "vendor": row.id,
        "security_owner": getUser().id,
        "review_status": false ,
        "review_status_reason": "Need Review",
        "last_review_date": reviewDate.toISOString()
      }
      let res = await createSecurityReview(payload);
      if (res.status) {
        res = await updateVendor(row.id, { managed: true, archived: false, organization: getUser().organization_id });
        updateLoader(false);
        if (res.status) {
            reload();
            return;
        }
      }
    }
    updateLoader(false);
  };

  const ReviewButton = {
    label: "Add",
    onClick: async () => {
      await moveRow(selectedRows, 3);
      setSelectedRows([]);
    },
    disabled: selectedRows.length !== 1,
  };

  const IgnoreButton = {
    label: "Ignore",
    onClick: async () => {
      await moveRow(selectedRows, 1);
      setSelectedRows([]);
    },
    disabled: selectedRows.length !== 1,
  };

  const RejectButton = {
    label: "Reject",
    onClick: async () => {
      await moveRow(selectedRows, 2);
      setSelectedRows([]);
    },
    disabled: selectedRows.length !== 1,
  };

  const needsReviewButtons = [ ReviewButton, IgnoreButton, RejectButton ];
  const ignoredButtons = [ ReviewButton, RejectButton ];
  const rejectedButtons = [ ReviewButton, IgnoreButton ];

  let headerButtons = [];
  switch (activeTab) {
    case 0:
      headerButtons = needsReviewButtons;
      break;
    case 1:
      headerButtons = ignoredButtons;
      break;
    case 2:
      headerButtons = rejectedButtons;
      break;
    default:
      headerButtons = needsReviewButtons;
  }

  return (
    <Box>
      <Box p={2}>
        <Typography variant="h4">
          Phase 1: Requirement Analysis / Vendor Selection
        </Typography>
      </Box>
      <Divider />
      <Box ml={4} mt={2}>
        <DiscoveryTabs activeTab={activeTab} handleChange={handleChange} />
        <TabPanel activeTab={activeTab} index={0}>
          <NeedsReview />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={1}>
          <Ignored />
        </TabPanel>
        <TabPanel activeTab={activeTab} index={2}>
          <Rejected />
        </TabPanel>
      </Box>
      <DiscoveryTable
        isLoading={isLoading}
        filterDropdowns={filterDropdowns}
        filters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        searchValue={searchValue}
        setSearchValue={updateSearchValue}
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

      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="inherit" />
        <Typography className="backdrop-label" variant="h5">
          Please wait...
        </Typography>
      </Backdrop>
    </Box>
  );
};

export default Discovery;
