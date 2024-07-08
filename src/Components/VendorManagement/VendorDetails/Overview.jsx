import { Box, Typography } from "@material-ui/core";
import FindingsTable from "./FindingsTable";
import { useStyle } from "../Utils";

const Overview = ({ findings, loading, sidebarOpen }) => {
  const classes = useStyle();
  const column_names = ["Finding", "Author"];

  const findings_columns = ["DESCRIPTION", "AUTHOR"];

  const rows = [findings];

  return (
    <Box className={classes.table}>
      <Box ml={4} mt={2}>
        <Typography variant="h6">Findings</Typography>
      </Box>
      <Box>
        <FindingsTable
          isLoading={loading}
          allColumns={column_names}
          columns={findings_columns}
          rows={rows}
        />
      </Box>
    </Box>
  );
};

export default Overview;
