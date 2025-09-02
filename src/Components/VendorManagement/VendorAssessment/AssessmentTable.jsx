import React from "react";
import { Box, Grid } from "@material-ui/core";
import TableHeader from "../TableHeader";
import DataTable from "../../Utils/DataTable/DataTable";
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from "../Utils";
import SkeletonBox from "../../Utils/SkeletonBox";
import { assessment_columns_width } from "../../../assets/data/VendorManagement/VendorAssessment/AssessmentColumns";
import { useHistory } from "react-router-dom";

const AssessmentTable = ({
  isLoading,
  filterDropdowns,
  filters,
  changeFilters,
  clearFilters,
  searchValue,
  setSearchValue,
  filteredRows,
  selectedRows,
  setSelectedRows,
  allColumns,
  visibleColumns,
  hideColumn,
  showColumn,
  matchedCell,
  headerButtons,
}) => {
  const classes = useStyle();
  const history = useHistory();

  const handleRowClick = (rowIndex) => {
    const vendorId = filteredRows[rowIndex].id;
    history.push(`/vendor-management/${vendorId}`);
    console.log("vendorId", vendorId);
  };

  // Map data to header
  const mapTableHeader = () => mapDataToHeader(visibleColumns);

  const mapTableBody = () =>
    generateRows(
      filteredRows,
      visibleColumns,
      selectedRows,
      matchedCell,
      handleRowClick
    );

  return (
    <Box className={classes.tableContainer}>
      <TableHeader
        tableFilters={filterDropdowns}
        activeFilters={filters}
        changeFilters={changeFilters}
        clearFilters={clearFilters}
        selectedRows={selectedRows}
        cols={{ allColumns, visibleColumns, hideColumn, showColumn }}
        searchValue={searchValue}
        updateSearch={(e) => setSearchValue(e.target.value)}
        headerButtons={headerButtons}
      />

      {isLoading() ? (
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
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              minCellWidth={visibleColumns.map(
                (name) => assessment_columns_width[allColumns.indexOf(name)]
              )}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AssessmentTable;
