import { Box, Divider, Grid, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import DoughnutChart from '../DoughnutChart';
import { generateRows, HeaderCell, mapDataToHeader, useStyle } from './Utils';
import TableHead from './TableHead';
import ReviewDecisionTableFilters from '../../../../assets/data/AccessManagement/ReviewDecisions/TableFilters';
import DataTable from '../../../Utils/DataTable/DataTable';
import { DECISION_COLUMNS, DECISION_COLUMNS_WIDTHS, HEADER_MAP } from '../../../../assets/data/AccessManagement/ReviewDecisions/Columns';
import { approveReview, getDecisions } from '../../../../Service/AccessManagement/Reviews';
import SkeletonBox from '../../../Utils/SkeletonBox';

const riskData = {
  labels: ["Access Appropriate", "Changes Required", "Need Review"],
  datasets: [
    {
      data: [21, 2, 0],
      backgroundColor: ["red", "orange", "gold"],
      borderColor: ["red", "orange", "gold"],
      borderWidth: 1,
    },
  ],
};

const borderColor = "#DAD8D8"

const ReviewDecisions = () => {

  const location = useLocation();
  const { data } = location.state || {};
  const reviewEntityId = data.id;
  const isReviewCompleted = useMemo(() => data.status === "Completed", [data]);

  const [filterDropdowns, setFilterDropdowns] = useState(ReviewDecisionTableFilters);

  const [activeFilters, setActiveFilters] = useState({
    role: [],
    flaggedAccounts: [],
    reviewStatus: []
  })

  const [loading, setLoading] = useState(false)

  // Save columns
  const [columns, setColumns] = useState(DECISION_COLUMNS);

  const [decisions, setDecisions] = useState([]);

  const fetchSetDecisions = useCallback(async (id) => {
    setLoading(true)
    const { status, data } = await getDecisions(id);
    if (status) setDecisions(data);
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSetDecisions(reviewEntityId);
  }, [fetchSetDecisions])

  const [selectedRows, setSelectedRows] = useState([]);

  const [matchedCell, setMatchedCell] = useState([])

  const changeDecision = async (row, decision) => {
    if (typeof decision === 'number' && !isNaN(decision)) return;
    const payload = {
      reviewlist_id_list: [row.id],
      flag: decision
    }
    try {
      const res = await approveReview(payload);
      if (res) fetchSetDecisions(reviewEntityId)
    }
    catch (err) {
      console.log(err)
    }
  }

  const classes = useStyle();

  const getMappedColumns = () => columns.map(column => HEADER_MAP[column])

  // Map data to header
  const mapTableHeader = () =>
    mapDataToHeader(columns);

  // Map data to body
  const mapTableBody = () =>
    generateRows(
      decisions,
      getMappedColumns(),
      changeDecision,
      isReviewCompleted,
      selectedRows,
      matchedCell,
      // sortingMap
    );

  return (
    <Box className={classes.reviewDecisionContainer}>
      <Box mt={2} style={{ display: "flex", justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box style={{ border: `1px solid ${borderColor}` }}>
              <Box borderBottom={`1px solid ${borderColor}`} p={2}>
                <Typography variant="body1">Access review progress</Typography>
              </Box>
              <Box p={2}>
                <DoughnutChart data={riskData} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box style={{ border: `1px solid ${borderColor}` }}>
              <Box borderBottom={`1px solid ${borderColor}`} p={2}>
                <Typography variant="body1">To-do list</Typography>
              </Box>
              <Box
                overflowY="scroll"
                height="183px"
              >
                <Box className={classes.todolistItem}>
                  <Box p={2}>
                    <Typography align="left">Complete access review</Typography>
                  </Box>
                  <Box p={2}>
                    <Typography>Due Apr 18</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box className={classes.todolistItem}>
                  <Box p={2}>
                    <Typography align="left">Start review</Typography>
                  </Box>
                  <Box p={2}>
                    <Typography>Due Jun 3</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box className={classes.todolistItem}>
                  <Box p={2}>
                    <Typography align="left">Complete review</Typography>
                  </Box>
                  <Box p={2}>
                    <Typography>Due Jun 17</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <TableHead
        tableFilters={filterDropdowns}
        filters={{ filters: activeFilters }}
      />

      {loading ?
        <SkeletonBox text="Loading Review list of Entity..." height='30vh' width='100%' /> :
        <Grid
          container
          spacing={1}
          className={classes.gridContainer}
        >
          <Grid
            item
            xs={12}
          >
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
              style={{ borderRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              minCellWidth={DECISION_COLUMNS_WIDTHS}

              // Pagination props
              currentPage={1}
              pageSize={10}
              totalItems={20}
              updatePageSize={() => { }}
              updatePageNumber={() => { }}
            />
          </Grid>
        </Grid>
      }
    </Box>
  )
}

export default ReviewDecisions