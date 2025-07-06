import { Box, Grid, Typography } from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HeaderCell,
  RowCell,
  generateRows,
  mapDataToHeader,
  useStyle,
} from "./RiskLibraryUtils";
import RiskLibraryHeader from "./RiskLibraryHeader";
import RiskLibraryFilters from "../../../assets/data/RiskManagement/RiskLibrary/RiskLibraryFilters";
import useLoading from "../../Utils/Hooks/useLoading";
import SkeletonBox from "../../Utils/SkeletonBox";
import DataTable from "../../Utils/DataTable/DataTable";
import { getLibrary } from "../../../Service/RiskManagement/RiskLibrary.service";
import {
  HEADER_TABLE_NAME_MAP,
  LibraryColumns,
  librayColumnWidths,
} from "../../../assets/data/RiskManagement/RiskLibrary/LibraryColumns";
import RiskFormDialog from "../RiskFormDialog";
import { cia_categories } from "../../../assets/data/RiskManagement/RiskRegister/RiskRegisterFilters";
import { createRisk } from "../../../Service/RiskManagement/RiskRegister.service";
import RiskManagementContext from "../RiskManagementContext";
import useSlider from "../../Utils/Hooks/useSlider";
import { notification } from "../../Utils/Utils";
import { getUser } from "../../../Service/UserFactory";

const RiskLibrary = () => {
  const hasEditRiskAccess = useMemo(() => {
    const user = getUser();
    return Boolean(
      user.roles[0].permissions.find((p) => p.permission_name === "edit_risk"),
    );
  }, []);

  // React state to maintain loading status
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Get categories and risk scores from RiskManagementContext, and populate it in our filterdropdown state
  const {
    categories: { categories },
    scores,
  } = useContext(RiskManagementContext);

  const prevPayload = useRef("");
  const searchedValue = useRef("");
  const [filters, setFilters] = useState({
    categories: [],
    register: [],
    // source: [],
  });

  // State to store page size, and function to update page size. function will be called from DataTable
  const [pagination, setPagination] = useState({
    page_no: 1,
    page_size: 5,
    total_items: null,
    total_pages: null,
  });
  const [loader, setLoader] = useState(0);
  const reload = () => setLoader((p) => (p === 100 ? 0 : p + 1));
  const updatePageSize = (size) => {
    setPagination((prev) => ({ ...prev, page_no: 1, page_size: size }));
    reload();
  };
  const updatePageNumber = (page) => {
    setPagination((prev) => ({ ...prev, page_no: page }));
    reload();
  };

  // SORTING
  const [sorting, setSorting] = useState(null);
  const updateSort = (colName) => {
    setSelectedRows([]);
    let currSort = {};
    if (sorting) {
      currSort = { ...sorting };
    }
    const sortName =
      HEADER_TABLE_NAME_MAP[colName] === "description"
        ? "scenario"
        : HEADER_TABLE_NAME_MAP[colName];
    if (currSort.sort_by === sortName) {
      currSort.sort_order = currSort.sort_order === 1 ? -1 : 1;
    } else {
      currSort = {
        sort_by: sortName,
        sort_order: 1,
      };
    }
    setSorting(currSort);
  };

  const abortControllerRef = useRef(null);

  // State to save library
  const [{ scenarios: library }, setLibrary] = useState({ scenarios: [] });
  const fetchLibrary = async () => {
    const payload = {
      filters: {},
      search: searchedValue.current,
      page_size: pagination.page_size,
      page_no: pagination.page_no,
      ...sorting,
    };
    if (filters.categories.length > 0) {
      payload.filters["categories"] = filters.categories;
    }
    if (filters.register.length > 0) {
      payload.filters["register"] = filters.register[0];
    }
    // if (filters.source.length > 0) {
    //   payload.filters['source'] = filters.source;
    // }
    const currPayload = JSON.stringify(payload);
    if (currPayload === prevPayload.current) {
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

    startLoading();
    const { data, status } = await getLibrary(payload, { signal: signal });

    if (!status) {
      stopLoading();
      return;
    }

    let paginationData = {
      page_no: data.page_no,
      page_size: data.page_size,
      total_items: data.total_items,
      total_pages: data.total_pages,
    };
    // if signal is not aborted, that means no new reqs were fired. so we can safely stop loading and set the state.
    if (!signal.aborted) {
      setLibrary({
        ...data,
        scenarios: data.scenarios.map((x) => ({
          ...x,
          Scenario: x.scenario,
          Categories: x.categories,
          Source: x.scenario_source === 0 ? "SYSTEM" : "CUSTOM",
          Framework: x.applicable_framework_name,
        })),
      });
      setPagination({
        ...paginationData,
        page_no: pagination.page_no > data.total_pages ? 1 : pagination.page_no,
      });
      stopLoading();
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [loader, sorting]);

  const filterStringified = useRef("");
  // Whenever any filters are changed, set page to 1
  const filterTrigger = () => {
    // If filters haven't changed, return;
    if (filterStringified.current === JSON.stringify(filters)) return;
    filterStringified.current = JSON.stringify(filters);
    setPagination((prev) => ({ ...prev, page_no: 1 }));
    reload();
  };

  // Save library columns
  const [libraryColumns, setLibraryColumns] = useState(LibraryColumns);

  // State to track selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const getCurrentIndex = () => {
    if (selectedRows.length === 0) return -1;
    return selectedRows[0];
  };

  const [matchedCell, setMatchedCell] = useState([]);

  const [filterDropdowns, setFilterDropdowns] = useState(RiskLibraryFilters);
  useEffect(() => {
    setFilterDropdowns((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        options: categories.map((c) => ({ id: c.id, text: c.category_name })),
      },
    }));
  }, [categories]);

  const changeFilters = (filterName, updatedFilterIds) => {
    setSelectedRows([]);
    setFilters((prev) => {
      return {
        ...prev,
        [filterName]: updatedFilterIds,
      };
    });
  };
  const clearFilters = (filterName) => {
    if (filterName) {
      setFilters((prev) => ({
        ...prev,
        [filterName]: [],
      }));
    } else {
      setFilters((prev) => {
        const obj = {};
        for (const key in prev) {
          obj[key] = [];
        }
        return obj;
      });
    }
  };

  const [addRiskForm, setAddRiskForm] = useState(false);
  const closeRiskForm = () => setAddRiskForm(false);

  const {
    getLikelihoodScore,
    getImpactScore,
    getLikelihoodSliderValue,
    getImpactSliderValue,
  } = useSlider(scores);

  const onAddFormSubmit = async (val) => {
    // Get the current library row
    const currentIndex = getCurrentIndex();
    const currentLibraryRow = library[currentIndex];

    // Add applicable_framework to the payload if available
    const payload = {
      scenario_id: currentLibraryRow.id,
      likelihood_id: scores.likelihoodScores.find(
        (score) => score.score === getLikelihoodScore(val.inherent_likelihood),
      ).id,
      impact_id: scores.impactScores.find(
        (score) => score.score === getImpactScore(val.inherent_impact),
      ).id,
      notes: val.notes,
      cia: cia_categories
        .filter((cia) => Boolean(val[cia.name]))
        .map((cia) => cia.id),
      custom_id: val.customId,
      ...(currentLibraryRow && currentLibraryRow.applicable_framework
        ? { applicable_framework: currentLibraryRow.applicable_framework }
        : {}),
    };
    const { status } = await createRisk(payload);
    if (status) {
      closeRiskForm();
      notification(
        "risk-add-success",
        "Risk Successfully Created !",
        "success",
      );
    }
  };

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(libraryColumns, sorting, updateSort);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      library,
      libraryColumns,
      selectedRows,
      matchedCell,
      categories,
      // sortingMap
    );

  const classes = useStyle();

  const onSearch = (val) => {
    searchedValue.current = val;
    fetchLibrary();
    setSelectedRows([]);
  };

  return (
    <Box className={classes.libraryContainer}>
      <Box className={classes.libraryHead}>
        <Typography className={classes.libraryTitle}>
          Falcon Risk Library
        </Typography>
        {/* <Typography className={classes.libraryCaption}>
          Select the risks that apply to your business and track them on your risk register.
        </Typography> */}
      </Box>

      <RiskLibraryHeader
        // Selected rows
        selectedRows={selectedRows}
        // Dropdown data for filters
        tableFilters={filterDropdowns}
        filters={{
          filters,
          changeFilters,
          clearFilters,
          triggerFilters: filterTrigger,
        }}
        // function to open add risk form on clicking add button
        openAddRiskForm={() => setAddRiskForm(true)}
        onSearch={onSearch}
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
              resizeTable={false}
              resizeAfterColumns={0}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              headerWrapper={(text) => <HeaderCell text={text} />}
              // rowWrapper={(text, colName) => <RowCell text={text} column={colName} />}
              style={{
                borderRadius: 5,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              minCellWidth={libraryColumns.map(
                (name) => librayColumnWidths[libraryColumns.indexOf(name)],
              )}
              // Pagination props
              currentPage={pagination.page_no}
              pageSize={pagination.page_size}
              totalItems={pagination.total_items}
              updatePageSize={updatePageSize}
              updatePageNumber={updatePageNumber}
            />
          </Grid>

          {/* <SecondaryTable
          data={getPoam()}
          currentRow={getRowIndex(getPoam(), secondaryOpen, sortingMap)}
          columnsList={secondaryColumns.filter(
            (name) => !hiddenColumns.includes(name)
          )}
          closeTable={() => setSecondaryOpen(-1)}
        /> */}
        </Grid>
      )}

      {addRiskForm && (
        <RiskFormDialog
          hasAccess={hasEditRiskAccess}
          open={addRiskForm}
          closeHandler={closeRiskForm}
          rowIndex={getCurrentIndex()}
          row={library[getCurrentIndex()]}
          isLibraryRow={true}
          autocompleteOptions={{
            categories,
          }}
          getSliderValue={{ getLikelihoodSliderValue, getImpactSliderValue }}
          scores={scores}
          onFormSubmit={onAddFormSubmit}
        />
      )}
    </Box>
  );
};

export default RiskLibrary;
