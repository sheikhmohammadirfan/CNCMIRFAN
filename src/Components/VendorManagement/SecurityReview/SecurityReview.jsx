import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import useLoading from "../../Utils/Hooks/useLoading";
import ReviewTable from "../SecurityReview/ReviewTable";
import ReviewFilters from "../../../assets/data/VendorManagement/SecurityReview/ReviewFilters";
import { review_columns } from "../../../assets/data/VendorManagement/SecurityReview/ReviewColumns";
import useParams from "../../Utils/Hooks/useParams";
import { HEADER_TABLE_COLS_MAP } from "../../../assets/data/VendorManagement/SecurityReview/ReviewColumns";

const SecurityReview = ({
  isLoading,
  vendorList,
  securityReviewList,
  reload,
}) => {
  const { params, changeParams, deleteParams } = useParams("review");
  const [reviewRows, setReviewRows] = useState([]);
  const [matchedCell, setMatchedCell] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!isLoading()) {
      const list = securityReviewList.map((s) => {
        const vendor = vendorList.find((v) => v.id === s.vendor);
        const review = {
          id: s.id,
          owner: s.security_owner,
          review: {
            due_date: s.last_review_date,
            status: s.review_status_reason,
          },
          last_date: s.last_review_date,
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
  const [filters, setFilters] = useState({
    risk: [],
    owner: [],
    review: params.review ? params.review.split(",") : [],
    date: [],
  });

  // Update filters when URL params change
  useEffect(() => {
    if (params.review) {
      setFilters((prev) => ({
        ...prev,
        review: params.review.split(","),
      }));
    }
  }, [params.review]);

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
        ? row["NAME / CATEGORY"].name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : true;

      const matchesFilters = Object.keys(filters).every((filterName) => {
        const activeFilterValues = filters[filterName];
        if (activeFilterValues.length === 0) {
          return true;
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
