import React from "react";
import { Box, Grid } from "@material-ui/core";
import DataTable from "../../Utils/DataTable/DataTable";
import { HeaderCell, generateRows, mapDataToHeader, useStyle } from "../Utils";
import SkeletonBox from "../../Utils/SkeletonBox";

const ReferencesTable = ({
  isLoading,
  allColumns,
  columns,
  rows,
  handleRowClick = () => {},
}) => {
  const classes = useStyle();

  const mapTableHeader = () => mapDataToHeader(allColumns);
  const mapTableBody = () => generateRows(rows[0], columns, rows[0], [], handleRowClick);
  
  const references_columns_width = [200, 200, 200, 200];
  
  return (
    <Box
      height="60vh"
      display="inline-block"
      className={classes.tableContainer}
    >
      {isLoading ? (
        <SkeletonBox text="Loading.." height="60vh" width="100%" />
      ) : (
        <Grid container spacing={1} className={classes.gridContainer}>
          <Grid item xs={12}>
            <DataTable
              className={classes.tableStyle}
              verticalBorder={true}
              header={mapTableHeader()}
              rowList={mapTableBody()}
              serialNo={false}
              resizeTable={true}
              headerWrapper={(text) => <HeaderCell text={text} />}
              minCellWidth={allColumns.map(
                (name) => references_columns_width[allColumns.indexOf(name)]
              )}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ReferencesTable;
