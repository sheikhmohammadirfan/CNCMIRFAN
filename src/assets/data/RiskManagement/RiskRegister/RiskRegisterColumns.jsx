// Column Names
export const risk_register_columns = [
  "Custom Id",
  "Scenario",
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
  "Approved",
  "Archived",
  "Vendors",
]

// Default Column widths
export const risk_register_columns_width = [
  150, 200, 150, 250, 150, 150, 150, 250, 150, 150, 150, 150, 150, 150, 150, 250, 150
];

// Used to map field names from api responses to names that are used in mapping headers of table
export const HEADER_TABLE_COLS_MAP = {
  "id": "ID",
  "custom_id": "Custom Id",
  "scenario": "Scenario",
  "source": "Source",
  "categories": "Categories",
  "owner": "Owner",
  "identified_date": "Identified Date",
  "modified_date": "Modified Date",
  "cia": "CIA",
  "inherent_risk_likelihood_id": "Inherent Risk Likelihood Id",
  "inherent_risk_impact_id": "Inherent Risk Impact Id",
  "residual_risk_likelihood_id": "Residual Risk Likelihood Id",
  "residual_risk_impact_id": "Residual Risk Impact Id",
  // "inherent_risk_score": "Inherent Risk",
  // "residual_risk_score": "Residual Risk",
  "notes": "Notes",
  "treatment": "Treatment",
  "task_ids": "Tasks",
  "is_approved": "Approved",
  "is_archived": "Archived",
  "vendors": "Vendors"
}