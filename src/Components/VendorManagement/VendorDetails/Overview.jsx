import { Box, Typography } from "@material-ui/core";
import FindingsTable from "./FindingsTable";
import { useStyle } from "../Utils";

const Overview = ({ findings, isLoading, sidebarOpen }) => {
  const classes = useStyle();
  const column_names = [
    "Finding",
    "Treatment plan",
    "Mitigation status",
    "Task status",
    "Linked risks",
  ];

  const findings_columns = [
    "description",
    "treatment_plan",
    "mitigation_status",
    "task_status",
    "linked_risks",
  ];

  const rows = findings ? findings.map(finding => {
    return {
      id: finding.id,
      author: finding.author,
      description: finding.description
    };
  }) : [];

  return (
    <Box className={classes.table}>
      <Box ml={4} mt={2}>
        <Typography variant="h6">Findings</Typography>
      </Box>
      <Box>
        <FindingsTable
          isLoading={isLoading}
          allColumns={column_names}
          columns={findings_columns}
          rows={rows}
        />
      </Box>
    </Box>
  );
};

export default Overview;
