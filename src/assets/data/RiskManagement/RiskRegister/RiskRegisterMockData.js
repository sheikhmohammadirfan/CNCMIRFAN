// Mock data to show in risk register table
// export const risk_register_rows = {
//   id: {
//     0: "1",
//     1: "2",
//   },
//   scenario: {
//     0: "a long, very long scenario",
//     1: "a long, very long scenario",
//   },
//   owner: {
//     0: "Affan",
//     1: "Irshad",
//   },
//   categories: {
//     0: ["Networking", "Data Science"],
//     1: ["Artificial Intelligence", "Machine Learning"],
//   },
//   identified: {
//     0: `${new Date()}`,
//     1: `${new Date()}`,
//   },
//   modified: {
//     0: `${new Date()}`,
//     1: `${new Date()}`
//   },
//   source: {
//     0: "Custom",
//     1: "Falcon Risk Library",
//   },
//   cia: {
//     0: ["Confidentiality", "Integrity"],
//     1: ["Integrity", "Availability"],
//   },
//   inherentRisk: {
//     0: 12,
//     1: 9,
//   },
//   treatment: {
//     0: JSON.stringify({ treatmentAction: "Avoid", treatmentStatus: "Incomplete" }),
//     1: JSON.stringify({ treatmentAction: "Mitigate", treatmentStatus: "Ok" }),
//   },
//   residualRisk: {
//     0: 6,
//     1: 15,
//   },
//   status: {
//     0: "Approved",
//     1: "Pending"
//   }
// }

// Mock Data to show in risk register table
export const risk_register_rows = [
  {
    id: 1,
    scenario: JSON.stringify({
      id: 1,
      description: "Assets are not identified and protected according to company requirements.",
      categories_id: [1, 3],
      source_type: "CUSTOM",
    }),
    owner: 2,
    identified_date: `${new Date()}`,
    modified_date: `${new Date()}`,
    cia: [2, 3],
    custom_id: "RISK-4",
    inherent_risk_likelihood_id: 3,
    inherent_risk_impact_id: 4,
    residual_risk_likelihood_id: 2,
    residual_risk_impact_id: 5,
    notes: "Hey this is a note",
    treatment: JSON.stringify({
      type: 1,
      controls: [1, 2],
      status: 1
    }),
    task_ids: [1, 2],
    is_approved: true,
    is_archived: false,
    vendors: [1, 2]
  },
  {
    id: 2,
    scenario: JSON.stringify({
      id: 1,
      description: "Exployees do not return equipment at termination resulting in loss of company resources and/or breach of company data.",
      categories_id: [2, 3],
      source_type: "SYSTEM",
    }),
    owner: 4,
    identified_date: `${new Date()}`,
    modified_date: `${new Date()}`,
    cia: [1, 3],
    custom_id: "CUSTOM-14",
    inherent_risk_likelihood_id: 2,
    inherent_risk_impact_id: 4,
    residual_risk_likelihood_id: 5,
    residual_risk_impact_id: 4,
    notes: "Hey this is a note",
    treatment: JSON.stringify({
      type: 2,
      controls: [1, 2],
      status: 0
    }),
    task_ids: [1, 2],
    is_approved: false,
    is_archived: false,
    vendors: [1, 2]
  },
]

export const dummy_row = {
  ID: 0,
  Scenario: JSON.stringify({
    id: 0,
    description: "",
    categories_id: [],
    source_type: "",
  }),
  Owner: "",
  "Identified Date": "",
  "Modified Date": "",
  CIA: [],
  "Custom Id": "",
  "Inherent Risk Likelihood Id": "",
  "Inherent Risk Impact Id": "",
  "Residual Risk Likelihood Id": "",
  "Residual Risk Impact Id": "",
  Notes: "",
  Treatment: JSON.stringify({
    type: -1,
    controls: [],
    status: -1
  }),
  Tasks: [],
  "Approved": false,
  "Archived": false,
  Vendors: []
}