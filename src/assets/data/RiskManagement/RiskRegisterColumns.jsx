// Column Names
export const risk_register_columns = [
  "Id",
  "Scenario",
  "Owner",
  "Identified Date",
  "Modified Date",
  "CIA",
  "Custom ID",
  "Inherent Risk",
  "Residual Risk",
  "Notes",
  "Treatment",
  "Tasks",
  "Approved",
  "Archived",
  "Vendors",
]

// Default Column widths
export const risk_register_columns_width = [
  60, 200, 150, 250, 150, 150, 150, 250, 150, 150, 150, 150, 150, 150, 150, 250, 150
];

// Used to map specific columns to table, and leave out some fields from backend api response
export const risk_register_table_cols = [
  "id",
  "scenario",
  "owner",
  "identified_date",
  "modified_date",
  "cia",
  "custom_id",
  "inherent_risk_score",
  "residual_risk_score",
  "notes",
  "treatment",
  "task_ids",
  "is_approved",
  "is_archived",
  "vendors"
]