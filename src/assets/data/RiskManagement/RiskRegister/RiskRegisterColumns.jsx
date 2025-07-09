// Column Names
export const risk_register_columns = [
  "Risk Id",
  "Scenario",
  "Applicable Framework",
  "Source",
  "Categories",
  "Owner",
  "Identified Date",
  "Modified Date",
  "CIA",
  "Inherent Risk",
  "Residual Risk",
  "Notes",
  "Treatment",
  "Tasks",
  "Detected From",
  "Approved",
  // "Archived",
  // "Vendors",
];

// Default Column widths
export const risk_register_columns_width = [
  150, 200, 200, 150, 250, 200, 150, 150, 250, 150, 150, 150, 150, 150, 150,
  150, 250, 150,
];

// Used to map field names from api responses to names that are used in mapping headers of table
export const HEADER_TABLE_COLS_MAP = {
  ID: "id",
  // "Risk Id": "risk_id",
  Scenario: "scenario",
  "Applicable Framework": "applicable_framework",
  Source: "source",
  Categories: "categories",
  Owner: "owner",
  "Identified Date": "identified_date",
  "Modified Date": "modified_date",
  CIA: "cia",
  "Inherent Risk Likelihood Id": "inherent_risk_likelihood_id",
  "Inherent Risk Impact Id": "inherent_risk_impact_id",
  "Residual Risk Likelihood Id": "residual_risk_likelihood_id",
  "Residual Risk Impact Id": "residual_risk_impact_id",
  "Inherent Risk": "inherent_risk",
  "Residual Risk": "residual_risk",
  Notes: "notes",
  Treatment: "treatment",
  Tasks: "task_ids",
  // "Detected From": "detected_from",
  Approved: "is_approved",
  Archived: "is_archived",
  Vendors: "vendors",
  // For mapping column names that are to be sent for sorting
};

export const HEADER_TABLE_FILTERS_MAP = {
  ID: "id",
  "Risk Id": "risk_id",
  Scenario: "scenario",
  "Applicable Framework": "applicable_framework",
  Source: "source",
  Categories: "category",
  Owner: "owners",
  "Identified Date": "identified_date",
  "Modified Date": "modified_date",
  CIA: "ciaCategories",
  "Inherent Risk": "inherentRisk",
  "Residual Risk": "residualRisk",
  Treatment: "treatment",
  Approved: "status",
};
