// Mock Data to show in assessment table
export const activeRows = [
  {
    id: 1,
    name_and_category: {
      name: "Apple",
      category: "Tech",
    },
    risk: "Medium",
    owner: "Owned by me",
    review: {
      due_date: "2024-1-10",
      status: "Up To Date",
    },
    last_date: "2022-1-10",
  },
  {
    id: 2,
    name_and_category: {
      name: "Google",
      category: "Tech",
    },
    risk: "Low",
    owner: "Owner unassigned",
    review: {
      status: "Need Review",
    },
    last_date: "2021-1-10",
  },
];

export const archivedRows = [
  {
    id: 3,
    name_and_category: {
      name: "Discord",
      category: "Unknown",
    },
    risk: "Critical",
    owner: "Owner offboarded",
    review: {
      due_date: "2024-1-10",
      status: "Need Update",
    },
    last_date: "2020-1-10",
  },
];
