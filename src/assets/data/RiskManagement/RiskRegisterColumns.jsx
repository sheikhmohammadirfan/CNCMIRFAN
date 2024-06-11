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

// Mapping from backend key names to what is to be shown on Frontend
// **Not being used currently**
export const risk_register_cols_map = {
  "id": "Id",
  "scenario": "Scenario",
  "owner": "Owner",
  "categories": "Categories",
  "identified": "Identified",
  "modified": "Modified",
  "source": "Source",
  "cia": "CIA",
  "inherentRisk": "Inherent Risk",
  "treatment": "Treatment",
  "residualRisk": "Residual Risk",
  "status": "Status",
}