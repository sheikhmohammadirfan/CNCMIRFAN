import { HEADER_TABLE_COLS_MAP } from "../../assets/data/VendorManagement/SecurityReview/ReviewColumns";
import {
  reviewRows,
  reviewFindings,
  reviewReferences,
} from "../../assets/data/VendorManagement/SecurityReview/ReviewMockData";

export const getReviewRows = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = reviewRows.map((row) => {
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

export const getReviewFindings = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = reviewFindings.map((row) => {
        const mappedRow = {
          ID: row.id,
          REVIEW: row.review,
          DESCRIPTION: row.description,
          AUTHOR: row.author,
        };
        return mappedRow;
      });
      res({ data: mappedRows, status: true });
    }, 1000);
  });
};

export const getReviewReferences = async () => {
  return new Promise((res) => {
    setTimeout(() => {
      const mappedRows = reviewReferences.map((row) => {
        const mappedRow = {
          ID: row.id,
          REVIEW: row.review,
          DOCUMENT_NAME: row.document_name,
          DOCUMENT_PATH: row.document_path,
          UPLOAD_DATE: row.upload_date,
          UPLOADED_BY: row.uploaded_by,
          DESCRIPTION: row.description,
        };
        return mappedRow;
      });
      res({ data: mappedRows, status: true });
    }, 1000);
  });
};
