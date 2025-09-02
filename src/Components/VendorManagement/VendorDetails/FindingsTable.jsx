import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Icon,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import DataTable from "../../Utils/DataTable/DataTable";
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from "../Utils";
import SkeletonBox from "../../Utils/SkeletonBox";
import { TextControl } from "../../Utils/Control";
import FilterDropdown from "../FilterDropdown";
import SlidingDrawer from "./SlidingDrawer";

const FindingsTable = ({ isLoading, allColumns, columns, rows }) => {
  const classes = useStyle();

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({ treatment_plan: [] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState({});
  const mapTableHeader = () => mapDataToHeader(allColumns);
  const mapTableBody = () =>
    generateRows(rows, columns, rows, [], handleRowClick);

  const findings_columns_width = [500, 200, 200, 200, 200];

  const clearFilters = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: [],
    }));
  };

  const changeFilters = (filterName, itemText) => {
    const updatedFilterTexts = filters[filterName].includes(itemText)
      ? filters[filterName].filter((text) => text !== itemText)
      : [...filters[filterName], itemText];

    setFilters((prev) => ({
      ...prev,
      [filterName]: updatedFilterTexts,
    }));
  };

  const filterRows = (rows, searchValue, filters) => {
    const filterMapping = {
      category: "treatment_plan",
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
        const rowField = filterMapping[filterName];
        const fieldPath = rowField.split(".");
        const fieldValue = fieldPath.reduce(
          (acc, field) => acc && acc[field],
          row
        );
        return activeFilterValues.includes(fieldValue);
      });

      return matchesSearch && matchesFilters;
    });
  };

  const filteredRows = filterRows(rows, searchValue, filters);

  const handleRowClick = (rowIndex) => {
    setSelectedFinding(filteredRows[rowIndex]);
    setIsDrawerOpen(true);
  };

  return (
    <Box
      display="inline-block"
      className={classes.tableContainer}
      width="100%"
    >
      {rows.length === 0 ? (
        <Box
          display="flex"
          height="60vh"
          flexDirection="column"
          borderColor="rgb(221, 221, 221)"
          overflow="auto"
        >
          <Box
            border={1}
            borderColor="rgb(221, 221, 221)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100%"
            mb={2}
            overflowY="scroll"
            justifyContent="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              height="100%"
              overflowY="scroll"
              justifyContent="center"
              width="400px"
            >
              <Typography variant="h6">No findings</Typography>
              <Typography variant="body2" align="center">
                As you analyze this vendor’s security evidence, use findings to
                document potential security gaps or other notes.
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box display="inline-flex" className={classes.tableContainer}>
          <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Box mr={2} mb={2}>
                  <TextControl
                    variant="outlined"
                    placeholder="Search findings"
                    size="small"
                    gutter={false}
                    label=" "
                    className={classes.searchInput}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {searchValue ? (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setSearchValue("")}
                            >
                              <Icon>close</Icon>
                            </IconButton>
                          ) : (
                            <Icon color="primary">search</Icon>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box mb={2}>
                  <FilterDropdown
                    filterName={"treatment_plan"}
                    buttonText={"Treatment Plan"}
                    filterOptions={[
                      { id: 0, text: "Accept risk" },
                      { id: 1, text: "Not applicable" },
                      { id: 2, text: "Needs mitigation" },
                    ]}
                    activeFilters={filters["treatment_plan"]}
                    changeFilters={changeFilters}
                    clearFilters={clearFilters}
                  />
                </Box>
              </Box>
              <DataTable
                className={classes.tableStyle}
                verticalBorder={true}
                header={mapTableHeader()}
                rowList={mapTableBody()}
                serialNo={false}
                resizeTable={true}
                headerWrapper={(text) => <HeaderCell text={text} />}
                minCellWidth={allColumns.map(
                  (name) => findings_columns_width[allColumns.indexOf(name)]
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <SlidingDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        findingDetails={selectedFinding}
      />
    </Box>
  );
};

export default FindingsTable;
