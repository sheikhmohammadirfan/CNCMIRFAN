const actionTrackerFilters = {
  assignee: {
    name: "assignee",
    text: "Assignee",
    order: 1,
    options: [],
  },
  internal_status: {
    name: "internal_status",
    text: "Falcon Status",
    order: 2,
    options: [
      {
        id: 1,
        name: "upcoming",
        text: "Upcoming",
      },
      {
        id: 2,
        name: "overdue",
        text: "Overdue",
      },
      {
        id: 3,
        name: "completed",
        text: "Completed",
      },
    ],
  },
  integrationStatus: {
    name: "integration_status",
    text: "Integration Status",
    order: 3,
    options: [],
  },
};

export default actionTrackerFilters;
