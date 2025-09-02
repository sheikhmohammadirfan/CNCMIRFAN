// Filters to show for the discovery table, with their dropdowns (filter options)
// "name" key's value should be same as the state variable that stores active filters in Discovery.jsx

// "options" key becomes an array of objects. all those objects should have "id" and "text" key for them to work

const DiscoveryFilters = {
  source: {
    name: "source",
    text: "Source",
    order: 1,
    options: [{id: 0, text: "Office 365"}, {id: 1, text: "Gmail"}, {id: 2, text: "Zoho"}],
  },
  risk: {
    name: "risk",
    text: "Inherent risk",
    order: 2,
    options: [{id: 0, text: "Critical"}, {id: 1, text: "High"}, {id: 2, text: "Medium"}, {id: 3, text: "Low"}, {id: 4, text: "Unknown"}],
  },
  date: {
    name: "date",
    text: "Date discovered",
    order: 3,
    options: [
      { id: 0, text: "This month" },
      { id: 1, text: "This quarter" },
      { id: 2, text: "This year"},
      { id: 3, text: "Custom", showDateRange: true},
    ],
  },
  accounts: {
    name: "accounts",
    text: "Number of accounts",
    order: 4,
    options: [],
  },
};

export default DiscoveryFilters;
