// Column Names
export const discovery_columns = [
  "NAME / CATEGORY",
  "SOURCE",
  "INHERENT RISK",
  "# OF ACCOUNTS",
  "DATE DISCOVERED",
]

// Default Column widths
export const discovery_columns_width = [
  350, 300, 300, 300, 300,
];

// Used to map field names from api responses to names that are used in mapping headers of table
export const HEADER_TABLE_COLS_MAP = {
	"id": "ID",
  "name_and_category": "NAME / CATEGORY",
  "source": "SOURCE",
	"risk": "INHERENT RISK",
	"accounts": "# OF ACCOUNTS",
	"date": "DATE DISCOVERED",
}