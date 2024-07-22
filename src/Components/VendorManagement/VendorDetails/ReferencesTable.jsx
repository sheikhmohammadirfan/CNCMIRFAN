import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
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
      m={0}
      className={classes.tableContainer}
      width="100%"
    >
      {rows[0].length === 0 ? ( 
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
              <Typography variant="h6">No files uploaded</Typography>
              <Typography variant="body2" align="center">
                Use this space to store documentation about this vendor.
                For security assessments, Falcon recommends uploading them to a security review to help structure your findings.
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box display="inline-flex">
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
        </Box>
      )}
    </Box>
  );
};

export default ReferencesTable;
