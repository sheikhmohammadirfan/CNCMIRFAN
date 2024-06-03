// Mock data to show in risk register table
export const risk_register_rows = {
  id: {
    0: "1",
    1: "2",
  },
  scenario: {
    0: "a long, very long scenario",
    1: "a long, very long scenario",
  },
  owner: {
    0: "Affan",
    1: "Irshad",
  },
  categories: {
    0: ["Networking", "Data Science"],
    1: ["Artificial Intelligence", "Machine Learning"],
  },
  identified: {
    0: `${new Date()}`,
    1: `${new Date()}`,
  },
  modified: {
    0: `${new Date()}`,
    1: `${new Date()}`
  },
  source: {
    0: "Custom",
    1: "Falcon Risk Library",
  },
  cia: {
    0: ["Confidentiality", "Integrity"],
    1: ["Integrity", "Availability"],
  },
  inherentRisk: {
    0: 12,
    1: 9,
  },
  treatment: {
    0: JSON.stringify({ treatmentAction: "Avoid", treatmentStatus: "Incomplete" }),
    1: JSON.stringify({ treatmentAction: "Mitigate", treatmentStatus: "Ok" }),
  },
  residualRisk: {
    0: 6,
    1: 15,
  },
  status: {
    0: "Approved",
    1: "Pending"
  }
}