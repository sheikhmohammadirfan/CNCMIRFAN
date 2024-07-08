import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import useLoading from "../../Utils/Hooks/useLoading";
import ReviewTable from "../SecurityReview/ReviewTable";
import ReviewFilters from "../../../assets/data/VendorManagement/SecurityReview/ReviewFilters";
import { getReviewRows } from "../../../Service/VendorManagement/Review.service";
import { review_columns } from "../../../assets/data/VendorManagement/SecurityReview/ReviewColumns";

const SecurityReview = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [reviewRows, setReviewRows] = useState([]);
  const [matchedCell, setMatchedCell] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      startLoading();
      try {
        const [reviewRes] = await Promise.all([getReviewRows()]);
        setReviewRows(reviewRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    })();
  }, []);

  const [filterDropdowns, setFilterDropdowns] = useState(ReviewFilters);
  const [filters, setFilters] = useState({
    risk: [],
    owner: [],
    review: [],
    date: [],
  });

  const changeFilters = (filterName, itemId, itemText) => {
    setFilters((prev) => {
      let currentFilters = prev[filterName] || [];
      let updatedFilterTexts = currentFilters.includes(itemText)
        ? currentFilters.filter((text) => text !== itemText)
        : [...currentFilters, itemText];
      return {
        ...prev,
        [filterName]: updatedFilterTexts,
      };
    });
  };

  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
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
