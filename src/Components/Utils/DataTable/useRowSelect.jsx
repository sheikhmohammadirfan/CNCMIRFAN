import { useState } from "react";

export const useRowSelect = (
  rowData,
  pageSize,
  selectedRows,
  setSelectedRows
) => {
  // Page index and current Starting index
  const [page, setPage] = useState(0);
  const [startIndex, setStart] = useState(0);
  const updatePage = (_, index) => {
    setPage(index);
    setStart(index * rowsPerPage);
    setSelectedRows([]);
  };

  // Method to add row
  const addRow = (index) => [...selectedRows, index];

  // Method to remove row
  const removeRow = (index) => selectedRows.filter((i) => i !== index);

  // Toggle check & uncheck status of row
  const toggleRow = (index, checked) =>
    setSelectedRows(() => (checked ? addRow(index) : removeRow(index)));

  // Method to splice row from start till length
  const sliceRowLength = (start, length) =>
    rowData.slice(start, start + length);

  // Method to check if row in list
  const isChecked = (index) => selectedRows.some((i) => i === index);

  // Toggle select All btn
  const toggleAllRows = (checked) =>
    setSelectedRows(() =>
      checked
        ? Array.from(
            Array(sliceRowLength(startIndex, rowsPerPage).length).keys()
          )
        : []
    );

  // Method to check if some files are selected
  const isSomeChecked = () =>
    selectedRows.length > 0 && selectedRows.length < getCurrMax();

  // Method to check if all files are selected
  const isAllChecked = () =>
    selectedRows.length > 0 && selectedRows.length === getCurrMax();

  // Method get max row count of current page
  const getCurrMax = () =>
    startIndex + rowsPerPage > rowData.length
      ? rowData.length - startIndex
      : rowsPerPage;

  // Store row per page
  const rowsPerPage = pageSize ? pageSize : rowData.length;

  return {
    sliceRowLength,
    page,
    updatePage,
    rowsPerPage,
    startIndex,
    toggleRow,
    isChecked,
    toggleAllRows,
    isSomeChecked,
    isAllChecked,
  };
};
