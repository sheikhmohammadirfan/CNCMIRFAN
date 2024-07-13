import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@material-ui/core";
import DiscoveryTabs from "./DiscoveryTabs";
import TabPanel from "../TabPanel";
import NeedsReview from "./NeedsReview";
import Rejected from "./Rejected";
import Ignored from "./Ignored";
import DiscoveryTable from "./DiscoveryTable";
import DiscoveryFilters from "../../../assets/data/VendorManagement/Discovery/DiscoveryFilters";
import { discovery_columns } from "../../../assets/data/VendorManagement/Discovery/DiscoveryColumns";
import useParams from "../../Utils/Hooks/useParams";

const Discovery = ({ isLoading, vendorList }) => {
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

  const unmanagedVendors = vendorList.filter(
    (vendor) => vendor.managed === false
  );

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedRows([]); // Reset selected rows when changing tabs
  };

  useEffect(() => {
    if (!isLoading()) {
      (async () => {
        setNeedsReviewRows(unmanagedVendors);
        setIgnoredRows(unmanagedVendors);
        setRejectedRows(unmanagedVendors);
      })();
    }
  }, [isLoading]);

  const [filterDropdowns, setFilterDropdowns] = useState(DiscoveryFilters);
  const [filters, setFilters] = useState({
    source: [],
    risk: params.risk ? params.risk.split(",") : [],
    date: [],
    accounts: [],
  });

  // Update filters when URL params change
  useEffect(() => {
    if (params.risk) {
      setFilters((prev) => ({
        ...prev,
        risk: params.risk.split(","),
      }));
    }
  }, [params.risk]);

  useEffect(() => {
    if (params.searchValue) {
      setSearchValue(params.searchValue);
    }
  }, [params.searchValue]);

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
        return (
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
  const moveRow = (rows, targetTab) => {
    // Copy the selected rows from the active tab then delete it
    let copyRows = [];
    if (activeTab === 0) {
      rows.forEach((row) => {
        copyRows.push(needsReviewRows[row]);
      });
      setNeedsReviewRows(
        needsReviewRows.filter((_, index) => !rows.includes(index))
      );
    }
    if (activeTab === 1) {
      rows.forEach((row) => {
        copyRows.push(ignoredRows[row]);
      });
      setIgnoredRows(ignoredRows.filter((_, index) => !rows.includes(index)));
    }
    if (activeTab === 2) {
      rows.forEach((row) => {
        copyRows.push(rejectedRows[row]);
      });
      setRejectedRows(rejectedRows.filter((_, index) => !rows.includes(index)));
    }

    // Add the copied rows from the active tab to the target tab
    if (targetTab === 0) {
      copyRows.forEach((row) => {
        setNeedsReviewRows((prev) => [...prev, row]);
      });
    }
    if (targetTab === 1) {
      copyRows.forEach((row) => {
        setIgnoredRows((prev) => [...prev, row]);
      });
    }
    if (targetTab === 2) {
      copyRows.forEach((row) => {
        setRejectedRows((prev) => [...prev, row]);
      });
    }
    if (targetTab === 3) {
      copyRows.forEach((row) => {
        row.managed = true;
      });
    }
    copyRows = [];
  };

  const needsReviewButtons = [
    {
      label: "Add",
      onClick: () => {
        moveRow(selectedRows, 3);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Ignore",
      onClick: () => {
        moveRow(selectedRows, 1);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Reject",
      onClick: () => {
        moveRow(selectedRows, 2);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
  ];

  const ignoredButtons = [
    {
      label: "Review",
      onClick: () => {
        moveRow(selectedRows, 0);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Reject",
      onClick: () => {
        moveRow(selectedRows, 2);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
  ];

  const rejectedButtons = [
    {
      label: "Review",
      onClick: () => {
        moveRow(selectedRows, 0);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
    {
      label: "Ignore",
      onClick: () => {
        moveRow(selectedRows, 1);
        setSelectedRows([]);
      },
      disabled: selectedRows.length === 0,
    },
  ];

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
    </Box>
  );
};

export default Discovery;
