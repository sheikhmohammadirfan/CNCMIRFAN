export const REQUIRED_COLUMNS = [
  "Name"
]

export const OPTIONAL_COLUMNS = [
  "Website",
  "Category",
  "Risk level",
  "Internal security owner",
  "Internal business owner",
  "Account manager name",
  "Account manager email",
  "Services provided",
  "Additional notes",
  "Visible to auditor",
]

export const COLUMN_DESCRIPTION_MAP = {
  "Name": "Name of the vendor",
  "Website": "URL of the vendor's website",
  "Category": "Vendor category - if category is provided and risk level is not, this vendor will be autoscored.",
  "Risk level": "Vendor risk level",
  "Internal security owner": "Email address of this vendor's security owner. Must be a user in Vanta",
  "Internal business owner": "Email address of this vendor's security owner. Must be a user in Vanta",
  "Account manager name": "Name of the manager of the account",
  "Account manager email": "Email of the manager of the account",
  "Services provided": "Services that the vendor provide",
  "Additional notes": "Notes about the vendor",
  "Visible to auditor": "If visible to auditor then true otherwise false"
}