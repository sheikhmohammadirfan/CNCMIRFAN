// Column Names
export const review_columns = [
  "NAME / CATEGORY",
  "INHERENT RISK",
  "SECURITY OWNER",
  "SECURITY REVIEW",
  "LAST REVIEWED",
];

// Default Column widths
export const review_columns_width = [300, 300, 350, 300, 300];

// Used to map field names from api responses to names that are used in mapping headers of table
export const HEADER_TABLE_COLS_MAP = {
  id: "ID",
  name_and_category: "NAME / CATEGORY",
  risk: "INHERENT RISK",
  owner: "SECURITY OWNER",
  review: "SECURITY REVIEW",
  last_date: "LAST REVIEWED",
};
