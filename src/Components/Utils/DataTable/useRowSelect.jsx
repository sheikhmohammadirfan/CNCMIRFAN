import { useEffect, useState } from "react";
import useCheck from "../Hooks/useCheck";

export default function useRowSelect(
  currentPage,
  rowData,
  pageSize,
  selectedRows,
  setSelectedRows,
) {
  // Page index and current Starting index (-1 because it stores index from 0.)
  const [page, setPage] = useState(currentPage - 1);
  const [startIndex, setStart] = useState(0);
  const updatePage = (_, index) => {
    setPage(index);
    setStart(index * rowsPerPage);
    setSelectedRows([]);
  };

  // Method to splice row from start till length
  const sliceRowLength = (start, length) =>
    rowData.slice(start, start + length);

  // Store row per page
  const rowsPerPage = pageSize ? pageSize : rowData.length;

  // Method get max row count of current page
  const getCurrMax = () =>
    startIndex + rowsPerPage > rowData.length
      ? rowData.length - startIndex
      : rowsPerPage;

  // Get method to manupulate check item list
  const {
    checkAtIndex,
    uncheckAtIndex,
    checkAll,
    uncheckAll,
    isCheckedAtIndex,
    isAllChecked,
    isSomeChecked,
  } = useCheck(selectedRows, setSelectedRows, getCurrMax());

  // Toggle check & uncheck status of row
  const toggleRow = (index, checked) =>
    checked ? checkAtIndex(index) : uncheckAtIndex(index);

  // Toggle select All btn
  const toggleAllRows = (checked) => (checked ? checkAll() : uncheckAll());

  return {
    sliceRowLength,
    page,
    updatePage,
    rowsPerPage,
    startIndex,
    toggleRow,
    toggleAllRows,
    isChecked: isCheckedAtIndex,
    isSomeChecked,
    isAllChecked,
  };
}
