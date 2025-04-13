import { Box, TablePagination } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

function DataTableHeader({
  component,
  pageSize,
  rowsPerPage,
  handleRowsPerPageChange,
  page,
  onPageChange,
  count,
}) {
  return (
    <Box display="flex" alignItems="center" justifyContent="end" sx={{ backgroundColor: 'white', borderTop: '1px solid #d9d9d9' }}>
      {component}
      {pageSize !== 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          count={count}
          component={Box}
          data-test="footer-pagination"
          sx={{ '&.MuiTablePagination-root': { overflow: 'visible' } }}
        />
      )}
    </Box>
  );
}
DataTableHeader.propTypes = {
  component: PropTypes.element,
  pageSize: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default DataTableHeader;
