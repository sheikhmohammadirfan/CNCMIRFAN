import { HEADER_TABLE_COLS_MAP } from "../../assets/data/VendorManagement/SecurityReview/ReviewColumns";
import {
  reviewRows,
  reviewFindings,
  reviewReferences,
} from "../../assets/data/VendorManagement/SecurityReview/ReviewMockData";
import { getSecurityReview } from "./VendorManagement.service";

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
