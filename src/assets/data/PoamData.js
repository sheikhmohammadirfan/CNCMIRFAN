export const poam_header = [
  "POAM ID",
  "Controls",
  "Weakness Name",
  "Weakness Description",
  "Weakness Detector Source",
  "Weakness Source Identifier",
  "Asset Identifier",
  "Point of Contact",
  "Resources Required",
  "Overall Remediation Plan",
  "Original Detection Date",
  "Scheduled Completion Date",
  "Planned Milestones",
  "Milestone Changes",
  "Status Date",
  "Vendor Dependency",
  "Last Vendor Check-in Date",
  "Vendor Dependent Product Name",
  "Original Risk Rating",
  "Adjusted Risk Rating",
  "Risk Adjustment",
  "False Positive",
  "Operational Requirement",
  "Deviation Rationale",
  "Supporting Documents",
  "Comments",
  "Auto-Approve",
  "justification",
];

export const secondary_columns = [
  "Auto-Approve",
  "Supporting Documents",
  "Risk Adjustment",
  "Original Risk Rating",
];

export const hidden_columns = ["justification"];

export const columns_width = [
  100, 100, 200, 200, 200, 200, 200, 200, 200, 200, 180, 180, 300, 400, 180,
  150, 200, 200, 150, 150, 150, 150, 150, 400, 400, 300, 150, 300,
];

export const capitalizeList = (lst) =>
  lst.map((name) =>
    name
      .split(" ")
      .map((str) => str[0].toUpperCase() + str.slice(1))
      .join(" ")
  );
