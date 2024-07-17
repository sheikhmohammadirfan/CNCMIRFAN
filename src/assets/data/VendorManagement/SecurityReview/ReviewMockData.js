// Mock Data to show in assessment table
export const reviewRows = [
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

export const reviewFindings = [
  {
    id: "1",
    review: "1",
    description: "Security issue 1",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description:
      "Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2 Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "1",
    review: "2",
    description: "Security issue 2",
    author: "Author 1",
  },
  {
    id: "2",
    review: "1",
    description: "Security issue 1",
    author: "Author 2",
  },
  {
    id: "3",
    review: "1",
    description: "Security issue 1",
    author: "Author 3",
  },
];

export const reviewReferences = [
  {
    id: "1",
    review: "1",
    document_name: "Security Document 1",
    document_path: "/path/to/document1",
    upload_date: "2023-06-01T00:00:00Z",
    uploaded_by: "John Doe",
    description: "Security document 1 description",
  },
  {
    id: "2",
    review: "1",
    document_name: "Security Document 1",
    document_path: "/path/to/document1",
    upload_date: "2023-06-01T00:00:00Z",
    uploaded_by: "John Doee",
    description: "Security document 1 description",
  },
  {
    id: "2",
    review: "2",
    document_name: "Security Document 2",
    document_path: "/path/to/document2",
    upload_date: "2023-06-01T00:00:00Z",
    uploaded_by: "John Doee",
    description: "Security document 2 description",
  },
  {
    id: "3",
    review: "1",
    document_name: "Security Document 1",
    document_path: "/path/to/document1",
    upload_date: "2023-06-01T00:00:00Z",
    uploaded_by: "John Doeee",
    description: "Security document 1 description",
  },
];
