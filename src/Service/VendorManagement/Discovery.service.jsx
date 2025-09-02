import { HEADER_TABLE_COLS_MAP } from "../../assets/data/VendorManagement/Discovery/DiscoveryColumns";
import {
  needsReviewRows,
  ignoredRows,
  rejectedRows,
} from "../../assets/data/VendorManagement/Discovery/DiscoveryMockData";

export const getNeedsReviewRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = needsReviewRows.map((row) => {
        const mappedRow = {};
        Object.keys(HEADER_TABLE_COLS_MAP).forEach((key) => {
          mappedRow[HEADER_TABLE_COLS_MAP[key]] = row[key];
        });
        return mappedRow;
      });
      res({ data: mappedRows, status: true });
    }, 1000);
  });
};

export const getIgnoredRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = ignoredRows.map((row) => {
        const mappedRow = {};
        Object.keys(HEADER_TABLE_COLS_MAP).forEach((key) => {
          mappedRow[HEADER_TABLE_COLS_MAP[key]] = row[key];
        });
        return mappedRow;
      });
      res({ data: mappedRows, status: true });
    }, 1000);
  });
};

export const getRejectedRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = rejectedRows.map((row) => {
        const mappedRow = {};
        Object.keys(HEADER_TABLE_COLS_MAP).forEach((key) => {
          mappedRow[HEADER_TABLE_COLS_MAP[key]] = row[key];
        });
        return mappedRow;
      });
      res({ data: mappedRows, status: true });
    }, 1000);
  });
};
