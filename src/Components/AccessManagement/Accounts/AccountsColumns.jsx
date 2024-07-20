// Column Names
// export const accountsColumns = [
//     "Account Name",
//     "Owner",
//     "Groups",
//     "Type",
//     "Status",
//     "MFA",
//     "Created",
//     "Deactivated",
//   ]
  


// mockData.js

export const mockData = [
  {
    accountName: "Account 1",
    owner: "Owner 1",
    groups: "Group 1",
    type: "Type 1",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },
  {
    accountName: "Account 2",
    owner: "Owner 2",
    groups: "Group 2",
    type: "Type 2",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 3",
    owner: "Owner 3",
    groups: "Group 3",
    type: "Type 3",
    status: "Inactive",
    mfa: "Disabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 4",
    owner: "Owner 4",
    groups: "Group 4",
    type: "Type 4",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 5",
    owner: "Owner 5",
    groups: "Group 5",
    type: "Type 5",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 6",
    owner: "Owner 6",
    groups: "Group 6",
    type: "Type 6",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 7",
    owner: "Owner 7",
    groups: "Group 7",
    type: "Type 7",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 8",
    owner: "Owner 8",
    groups: "Group 8",
    type: "Type 8",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },  {
    accountName: "Account 9",
    owner: "Owner 9",
    groups: "Group 9",
    type: "Type 9",
    status: "Active",
    mfa: "Enabled",
    created: "2023-01-01",
  },
  {
    accountName: "Account 10",
    owner: "Owner 10",
    groups: "Group 10",
    type: "Type 10",
    status: "Inactive",
    mfa: "Disabled",
    created: "2023-02-01",
  },
  {
    accountName: "Account 11",
    owner: "Owner 11",
    groups: "Group 11",
    type: "Type 11",
    status: "Inactive",
    mfa: "Disabled",
    created: "2023-02-01",
  },
  {
    accountName: "Account 12",
    owner: "Owner 12",
    groups: "Group 12",
    type: "Type 12",
    status: "Inactive",
    mfa: "Disabled",
    created: "2023-02-01",
  },
];

export const serviceOptions = ["AWS-65842121464", "AWS-3646661614", "GCP", "Github"];
export const ownerOptions = ["Owner 1", "Owner 2"];
export const typeOptions = ["Type-1", "Type-2"];
export const statusOptions = ["Active", "Inactive"];
export const mfaOptions = ["Enabled", "Disabled"];




export const tableMockData = [
  {
    name: "Project Sigma",
    owner: "Hanz Daoang",
    dateStarted: "2023-01-10",
    dateCompleted: "",
    status: "In Review"
  },
  {
    name: "Project Alpha",
    accountName:"abc@gmail.com",
    system: "System Alpha",
    reviewer: "Alice Johnson",
    inherentRisk: "Low",
    integrationStatus: "Yes",
    reviewDecision: "Approved",
    noteTask: "Review documentation",
    remediationStatus: "Complete",
    dateStarted: "2023-01-15",
    dateCompleted: "2023-06-20",
    status: "Completed"
  },
  {
    name: "Project Beta",
    accountName:"abc@gmail.com",
    system: "System Beta",
    reviewer: "Bob Smith",
    inherentRisk: "Medium",
    integrationStatus: "No",
    reviewDecision: "Pending",
    noteTask: "Follow up on integration",
    remediationStatus: "In Progress",
    dateStarted: "2023-02-10",
    dateCompleted: "",
    status: "Draft"
  },
  {
    name: "Project Gamma",
    accountName:"abc@gmail.com",
    system: "System Gamma",
    reviewer: "Charlie Davis",
    inherentRisk: "High",
    integrationStatus: "Yes",
    reviewDecision: "Rejected",
    noteTask: "Schedule re-evaluation",
    remediationStatus: "Not Started",
    dateStarted: "2023-03-05",
    dateCompleted: "",
    status: "In Review"
  },
  {
    name: "Project Delta",
    accountName:"abc@gmail.com",
    system: "System Delta",
    reviewer: "Dana Lee",
    inherentRisk: "Medium",
    integrationStatus: "No",
    reviewDecision: "Approved",
    noteTask: "Update documentation",
    remediationStatus: "Complete",
    dateStarted: "2023-04-20",
    dateCompleted: "2023-08-30",
    status: "Completed"
  },
  {
    name: "Project Epsilon",
    accountName:"abc@gmail.com",
    system: "System Epsilon",
    reviewer: "Eve Martinez",
    inherentRisk: "Low",
    integrationStatus: "Yes",
    reviewDecision: "Pending",
    noteTask: "Collect more data",
    remediationStatus: "In Progress",
    dateStarted: "2023-05-12",
    dateCompleted: "",
    status: "Draft"
  },
  {
    name: "Project Zeta",
    accountName:"abc@gmail.com",
    system: "System Zeta",
    reviewer: "Franklin Harris",
    inherentRisk: "High",
    integrationStatus: "No",
    reviewDecision: "Rejected",
    noteTask: "Implement changes",
    remediationStatus: "Not Started",
    dateStarted: "2023-06-01",
    dateCompleted: "2023-09-15",
    status: "Completed"
  },
  {
    name: "Project Eta",
    accountName:"abc@gmail.com",
    system: "System Eta",
    reviewer: "Grace Parker",
    inherentRisk: "Medium",
    integrationStatus: "Yes",
    reviewDecision: "Approved",
    noteTask: "Complete final review",
    remediationStatus: "Complete",
    dateStarted: "2023-07-10",
    dateCompleted: "",
    status: "In Review"
  },
  {
    name: "Project Theta",
    accountName:"abc@gmail.com",
    system: "System Theta",
    reviewer: "Henry Wilson",
    inherentRisk: "Low",
    integrationStatus: "No",
    reviewDecision: "Pending",
    noteTask: "Prepare for review",
    remediationStatus: "In Progress",
    dateStarted: "2023-08-15",
    dateCompleted: "",
    status: "Draft"
  }
];



