const registerFilterOptions = [
  {
    id: 1,
    text: "Added"
  },
  {
    id: 2,
    text: "Not Added"
  }
]

const RiskLibraryFilters = {
  categories: {
    name: "categories",
    text: "Categories",
    order: 1,
    options: []
  },
  register: {
    name: "register",
    text: "Risk Register",
    order: 2,
    options: [...registerFilterOptions]
  }
}

export default RiskLibraryFilters;