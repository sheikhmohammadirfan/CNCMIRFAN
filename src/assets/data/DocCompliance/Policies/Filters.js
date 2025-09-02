const FILTERS = {
  internal_status: {
    name: "status",
    text: "Status",
    order: 1,
    options: [
      {
        id: 1,
        name: "draft",
        text: "Draft",
      },
      {
        id: 2,
        name: "in_review",
        text: "In Review",
      },
      {
        id: 3,
        name: "completed",
        text: "Completed",
      },
    ],
  },
  integrationStatus: {
    name: "framework",
    text: "Framework",
    order: 2,
    options: [
      {
        id: 1,
        name: 'gdpr',
        text: "GDPR"
      },
      {
        id: 2,
        name: 'hipaa',
        text: "HIPAA"
      },
      {
        id: 3,
        name: 'fedramp',
        text: "FedRAMP"
      },
      {
        id: 4,
        name: 'pci_dss',
        text: "PCI DSS"
      },
    ],
  },
};

export default FILTERS;
