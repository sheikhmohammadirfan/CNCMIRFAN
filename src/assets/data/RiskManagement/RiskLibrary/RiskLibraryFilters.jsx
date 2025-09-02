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

const sourceFilterOptions = [
  {
    id: 1,
    text: "System"
  },
  {
    id: 2,
    text: "Custom"
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
  },
  // source: {
  //   name: "source",
  //   text: "Source",
  //   order: 3,
  //   options: [...sourceFilterOptions]
  // }
}

export default RiskLibraryFilters;