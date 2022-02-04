import { Box, TablePagination } from "@material-ui/core";
import React from "react";

export default function DataTableFooter({
  component,
  pageSize,
  rowsPerPage,
  page,
  onPageChange,
  count,
}) {
  return (
    <caption style={{ padding: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {component}
        {pageSize !== 0 && (
          <TablePagination
            rowsPerPageOptions={[]}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            count={count}
            component={Box}
          />
        )}
      </Box>
    </caption>
  );
}
