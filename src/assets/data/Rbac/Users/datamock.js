export const usersMock = [
  {
    id: 1,
    name: "Affan Ansari",
    email: 'affan@cncmllc.com',
    role: JSON.stringify([{id: '1', label: "Super Admin"}]),
    source: 'Manual',
    status: 'Inactive'
  },
  {
    id: 2,
    name: "Irshad Siddiqui",
    email: 'irshad@cncmllc.com',
    role: JSON.stringify([{id: '1', label: "Admin"}]),
    source: 'Upload',
    status: 'Active'
  },
  {
    id: 3,
    name: "Sharique Shaikh",
    email: 'sharique@cncmllc.com',
    role: JSON.stringify([{id: '1', label: "User"}]),
    source: 'Manual',
    status: 'InActive'
  },
  {
    id: 4,
    name: "Saif Mulla",
    email: 'saif@cncmllc.com',
    role: JSON.stringify([{id: '1', label: "Risk Manager"}]),
    source: 'Upload',
    status: 'Active'
  },
]