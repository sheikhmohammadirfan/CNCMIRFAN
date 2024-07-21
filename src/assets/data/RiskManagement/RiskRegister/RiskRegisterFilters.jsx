// "name" key is for the checkboxes inside edit risk form to work
export const cia_categories = [
  {
    id: 1,
    name: "uncategorized",
    text: "Uncategorized"
  },
  {
    id: 2,
    name: "availability",
    text: "Availability"
  },
  {
    id: 3,
    name: "confidentiality",
    text: "Confidentiality"
  },
  {
    id: 4,
    name: "integrity",
    text: "Integrity"
  },
]

export const treatmentTypes = [
  {
    id: 0,
    text: "No treatment type"
  },
  {
    id: 1,
    text: "Accept"
  },
  {
    id: 2,
    text: "Avoid"
  },
  {
    id: 3,
    text: "Mitigate"
  },
  {
    id: 4,
    text: "Transfer"
  }
]

// "name" and "val" key are to populate dropdowns inside Edit Risk form
export const source_options = [
  {
    id: 0,
    name: "Library Risk",
    text: "Library Risk",
    val: 0
  },
  {
    id: 1,
    name: "Custom Risk",
    text: "Custom Risk",
    val: 1
  },
]

export const status_options = [
  {
    id: 0,
    text: "Not Approved",
  },
  {
    id: 1,
    text: "Approved",
  },
]

export const identified_options = [
  {
    id: 0,
    text: "Last 3 months",
  },
  {
    id: 1,
    text: "Last 6 months",
  },
  {
    id: 2,
    text: "Last year",
  },
  {
    id: 3,
    text: "Custom",
    showDateRange: true
  },
]

// Filters to show for the Risk register table, with their dropdowns (filter options)
// some "options" keys get populated with objects in the RiskRegister component, after filters are fetched from backend
// "name" key's value should be same as the state variable that stores active filters in RiskRegister.jsx

// "options" key becomes an array of objects. all those objects should have "id" and "text" key for them to work

const RiskRegisterFilters = {
  owners: {
    name: "owners",
    text: "Owners",
    order: 1,
    options: []
  },
  category: {
    name: "category",
    text: "Categories",
    order: 2,
    options: []
  },
  treatment: {
    name: "treatment",
    text: "Treatment",
    order: 3,
    options: [...treatmentTypes]
  },
  inherentRisk: {
    name: "inherent",
    text: "Inherent",
    order: 4,
    options: []
  },
  residualRisk: {
    name: "residual",
    text: "Residual",
    order: 5,
    options: []
  },
  ciaCategories: {
    name: "ciaCategories",
    text: "CIA",
    order: 6,
    options: [...cia_categories]
  },
  source: {
    name: "source",
    text: "Source",
    order: 7,
    options: [...source_options]
  },
  status: {
    name: "status",
    text: "Status",
    order: 8,
    options: [...status_options]
  },
  identified_date: {
    name: "identified",
    text: "Identified",
    order: 9,
    options: [...identified_options]
  }
}

export default RiskRegisterFilters;