import { Box, Grid } from "@material-ui/core";
import PoamHeader from "../PoamHeader";
import PoamDetails from "../PoamDetails";
import SkeletonBox from "../../Utils/SkeletonBox";
import DataTable from "../../Utils/DataTable/DataTable";
import { HeaderCell, RowCell } from "../PoamUtils";
import SecondaryTableWrapper from "../SecondaryTable";

export default function PoamDataTable({
  classes,
  fullScreen: { isZoomed, zoomIn, zoomOut },
  data: {
    selectedRow,
    setSelectedRow,
    fileID,
    poamData,
    getPoam,
    setSecondaryOpen,
    getRowIndex,
    sortingMap,
    poamDetails,
    isLoading,
  },
  manageCol: {
    allColumns,
    secondaryColumns,
    hiddenColumns,
    visibleColumns,
    moveToPrimary,
    moveToSecondary,
  },
  manageRow: { openEditFrom, openCreateForm, openJustify },
  manageSheet: { isOpenPoam, showOpenPoam, showClosePoam },
  manageJira: { containIssue, showCreateIssue, showUpdateIssue },
  manageTask: { isTaskVisible, showTaskTracker, hideTaskTracker },
  search: {
    matchedCell,
    setMatched,
    searchSelected,
    setSelected,
    setSearchTerm,
    searchTerm,
  },
  manageTable: { secondaryOpen, mapTableHeader, mapTableBody, columns_width },
}) {
  return (
    <Box
      id="poam-root"
      className={`${classes.poamContainer} ${isZoomed() ? "zoomed" : ""}`}
      // sx={{backgroundColor:'red'}}
    >
      <Box sx={{width:'100%',height:'auto',mb:2}}>
      <PoamDetails poamDetails={poamDetails} loading={isLoading()} />
      </Box>
      <PoamHeader
        selectedRow={selectedRow}
        zoom={{ isZoomed, zoomIn, zoomOut }}
        details={{ fileID }}
        poamData={poamData}
        cols={{ allColumns, secondaryColumns, hiddenColumns, visibleColumns }}
        manageCol={{ moveToPrimary, moveToSecondary }}
        manageRow={{ openEditFrom, openCreateForm, openJustify }}
        manageSheet={{ isOpenPoam, showOpenPoam, showClosePoam }}
        manageJira={{ containIssue, showCreateIssue, showUpdateIssue }}
        manageTask={{ isTaskVisible, showTaskTracker, hideTaskTracker }}
        search={{
          matchedCell,
          setMatched,
          searchSelected,
          setSelected,
          setSearchTerm,
        }}
      />

      {/* <PoamDetails poamDetails={poamDetails} loading={isLoading()} /> */}

      {isLoading() ? (
        <SkeletonBox text="Loading.." height="60vh" width="100%" />
      ) : (
        <Grid
          container
          spacing={1}
          className={`${classes.gridContainer} ${isZoomed() ? "zoomed" : ""}`}
        >
          <Grid item xs={secondaryOpen !== -1 ? 9 : 12}>
            <DataTable
              className={`poam-table ${classes.tableStyle} ${
                isOpenPoam ? "o" : ""
              }`}
              verticalBorder={true}
              header={mapTableHeader()}
              rowList={mapTableBody()}
              checkbox={true}
              serialNo={false}
              resizeTable={true}
              resizeAfterColumns={1}
              selectedRows={selectedRow}
              setSelectedRows={setSelectedRow}
              headerWrapper={(text) => <HeaderCell text={text} />}
              rowWrapper={(text, colName, rowIndex, colIndex) => <RowCell text={text} rowIndex={rowIndex} colIndex={colIndex} />}
              style={{
                borderRadius: 5,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              minCellWidth={visibleColumns.map(
                (name) => columns_width[allColumns.indexOf(name)]
              )}
              searchTerm={searchTerm}
            />
          </Grid>

          <SecondaryTableWrapper
            data={getPoam()}
            currentRow={getRowIndex(getPoam(), secondaryOpen, sortingMap)}
            columnsList={secondaryColumns.filter(
              (name) => !hiddenColumns.includes(name)
            )}
            closeTable={() => setSecondaryOpen(-1)}
          />
        </Grid>
      )}
    </Box>
  );
}
