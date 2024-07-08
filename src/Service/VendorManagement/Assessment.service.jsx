import { HEADER_TABLE_COLS_MAP } from "../../assets/data/VendorManagement/VendorAssessment/AssessmentColumns";
import {
  activeRows,
  archivedRows,
} from "../../assets/data/VendorManagement/VendorAssessment/AssessmentMockData";

export const getActiveRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = activeRows.map((row) => {
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

export const getArchivedRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = archivedRows.map((row) => {
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
