// Dummy filters to show for the Risk register table, with their dropdowns (filter options)
// "name" key's value should be same as the state variable that stores active filters in RiskRegister.jsx
const RiskRegisterFilters = [
  {
    name: "owners",
    text: "Owners",
    order: 0,
    options: [
      {
        text: "Affan",
        id: 0,
        order: 0,
      },
      {
        text: "Irshad",
        id: 1,
        order: 1,
      },
    ]
  },
  {
    name: "categories",
    text: "Categories",
    order: 1,
    options: [
      {
        text: "Networking",
        id: 0,
        order: 0,
      },
      {
        text: "Artificial Intelligence",
        id: 1,
        order: 1,
      },
      {
        text: "Machine Learning",
        id: 2,
        order: 2,
      },
      {
        text: "Cloud Infrastructure",
        id: 3,
        order: 3,
      },
    ]
  },
]

export default RiskRegisterFilters;