import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import ReviewTable from "../SecurityReview/ReviewTable";
import ReviewFilters from "../../../assets/data/VendorManagement/SecurityReview/ReviewFilters";
import { review_columns } from "../../../assets/data/VendorManagement/SecurityReview/ReviewColumns";
import useParams from "../../Utils/Hooks/useParams";
import { HEADER_TABLE_COLS_MAP } from "../../../assets/data/VendorManagement/SecurityReview/ReviewColumns";
import { getOwners } from "../../../Service/RiskManagement/RiskManagement.service.jsx";

const SecurityReview = ({
  isLoading,
  vendorList,
  securityReviewList,
  ownersList,
  reload,
}) => {
  const { params, changeParams, deleteParams } = useParams("review", "risk");
  const [reviewRows, setReviewRows] = useState([]);
  const [matchedCell, setMatchedCell] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!isLoading()) {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
      };
      const owners = {};
      ownersList.forEach(owner => {
        owners[owner.email] = `${owner.first_name} ${owner.last_name}`;
      });
      const list = securityReviewList.map((s) => {
        const vendor = vendorList.find((v) => v.id === s.vendor);
        
        const dueDate = s.last_review_date;
        const review = {
          id: vendor.id,
          owner: owners[s.security_owner],
          review: {
            due_date: formatDate(dueDate),
            status: s.review_status_reason,
          },
          last_date: formatDate(s.last_review_date) ,
          name_and_category: {
            name: vendor.vendor_name,
            category: vendor.category,
          },
          risk: vendor.inherent_risk,
        };
        return review;
      });
      const mappedRows = list.map((row) => {
        const mappedRow = {};
        Object.keys(HEADER_TABLE_COLS_MAP).forEach((key) => {
          mappedRow[HEADER_TABLE_COLS_MAP[key]] = row[key];
        });
        return mappedRow;
      });
      setReviewRows(mappedRows);
    }
  }, [isLoading, securityReviewList]);

  const [filterDropdowns, setFilterDropdowns] = useState(ReviewFilters);

  const extractUniqueValues = (rows, key) => {
    const uniqueValues = [...new Set(rows.map(row => row[key]))];
    return uniqueValues.map((value, index) => ({ id: index, text: value }));
  };

  const updateFilterDropdowns = (rows) => {
    setFilterDropdowns((prev) => ({
      ...prev,
      securityOwner: {
        name: "owner",
        text: "Security owner",
        order: 3,
        options: [
          { id: 0, text: "Owned by me" },
          { id: 1, text: "Owner unassigned" },
          { id: 2, text: "Owner offboarded" },
          ...extractUniqueValues(rows, "SECURITY OWNER"),
        ],
      },
    }));
  }; 

  useEffect(() => {
    console.log(reviewRows)
    updateFilterDropdowns(reviewRows);
  }, [reviewRows]);

  const [filters, setFilters] = useState({
    risk: params.risk ? params.risk.split(",") : [],
    owner: [],
    review: params.review ? params.review.split(",") : [],
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
    if (params.review) {
      setFilters((prev) => ({
        ...prev,
        review: params.review.split(","),
      }));
    }
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
    return rows.filter((row) => {
      const matchesSearch = searchValue
        ? row["NAME / CATEGORY"].name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : true;

      const matchesFilters = Object.keys(filters).every((filterName) => {
        const activeFilterValues = filters[filterName];
        if (activeFilterValues.length === 0) {
          return true;
        }

        if (filterName === 'date') {
          const currentDate = new Date();
          const reviewDueDate = new Date(row["SECURITY REVIEW"].due_date);
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

        return (
          activeFilterValues.includes(row["SECURITY OWNER"]) ||
          activeFilterValues.includes(row["SECURITY REVIEW"].status) ||
          activeFilterValues.includes(row["NAME / CATEGORY"].category) ||
          activeFilterValues.includes(row.SOURCE) ||
          activeFilterValues.includes(row["INHERENT RISK"])
        );
      });

      return matchesSearch && matchesFilters;
    });
  };

  const filteredRows = filterRows(reviewRows, searchValue, filters);

  const [allColumns, setAllColumns] = useState(review_columns);
  const [visibleColumns, setVisibleColumns] = useState(review_columns);

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

  return (
    <Box>
      <Box p={2}>
        <Typography variant="h4">Security Review</Typography>
      </Box>
      <Divider />
      <ReviewTable
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
      />
    </Box>
  );
};

export default SecurityReview;
