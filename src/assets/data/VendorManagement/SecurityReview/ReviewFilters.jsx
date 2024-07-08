const ReviewFilters = {
  risk: {
    name: "risk",
    text: "Inherent risk",
    order: 1,
    options: [
      { id: 0, text: "Critical" },
      { id: 1, text: "High" },
      { id: 2, text: "Medium" },
      { id: 3, text: "Low" },
      { id: 4, text: "Unknown" },
    ],
  },
  securityOwner: {
    name: "owner",
    text: "Security owner",
    order: 2,
    options: [
      { id: 0, text: "Owned by me" },
      { id: 1, text: "Owner unassigned" },
      { id: 2, text: "Owner offboarded" },
    ],
  },
  reviewStatus: {
    name: "review",
    text: "Review status",
    order: 3,
    options: [
      { id: 0, text: "Up to date" },
      { id: 1, text: "Needs initial review" },
      { id: 2, text: "Needs update" },
      { id: 3, text: "Not required" },
    ],
  },
  date: {
    name: "date",
    text: "Security review due date",
    order: 4,
    options: [],
  },
};

export default ReviewFilters;
