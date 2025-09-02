export const COLUMNS = [
  "Name",
  "Framework",
  "Policy status",
  "Renew by",
  "Document Owner",
  "Policy Owner",
  "Last Modified By"
]

export const COL_WIDTHS = [
  450, 350, 250, 250, 250, 250, 350
]

export const HEADER_TABLE_COLS_MAP = {
  "Name": "name",
  "Framework": "framework",
  "Policy status": "policy_status",
  "Renew by": "renew_by",
  "Document Owner": "document_owner",
  "Policy Owner": "policy_owner",
  "Last Modified By": "last_modified_by"
}

export const STATUS_MAP = {
  0: {
    text: "Draft",
    dotColor: "red"
  },
  1: {
    text: "In Review",
    dotColor: "#ffd54f"
  },
  2: {
    text: "Completed",
    dotColor: "#4caf50"
  }
}