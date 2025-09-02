const ReviewDecisionTableFilters = {
  role: {
    name: "role",
    text: "Categories",
    order: 1,
    options: [
      {
        id: 0,
        text: "User"
      }
    ]
  },
  flaggedAccounts: {
    name: "flaggedAccounts",
    text: "Flagged Accounts",
    order: 2,
    options: [
      {
        id: 0,
        text: "Affan"
      }
    ]
  },
  reviewStatus: {
    name: "reviewStatus",
    text: "Reivew Status",
    order: 3,
    options: [
      {
        id: 0,
        text: "Completed"
      }
    ]
  }
}

export default ReviewDecisionTableFilters;