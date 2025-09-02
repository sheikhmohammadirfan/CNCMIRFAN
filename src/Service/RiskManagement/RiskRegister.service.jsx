import { get, post, put } from "../CrudFactory";

export async function getRegister(payload, signal) {
  return await post("/risk/", payload, signal);
}

export async function updateRegister(id, payload) {
  return await put(`/risk/update/${id}/`, payload);
}

export async function createRisk(data) {
  return await post("/risk/create/", data);
}

export async function getRiskScoreGroups() {
  await new Promise((res) => setTimeout(() => res()), 1000);
  return {
    data: [
      {
        id: 1,
        name: "Low",
        description:
          "A threat event could be expected to have a limited adverse effect on organizational operations, mission capabilities, assets, individuals, customers, or other organizations.",
        range_from: 1,
        range_to: 4,
        color: "#00FF00",
        source_type: 0,
      },
      {
        id: 2,
        name: "Mid",
        description:
          "A threat event could be expected to have a serious adverse effect on organizational operations, mission capabilities, assets, individuals, customers, or other organizations.",
        range_from: 5,
        range_to: 14,
        color: "#FFFF00",
        source_type: 0,
      },
      {
        id: 3,
        name: "High",
        description:
          "A threat event could be expected to have a severe adverse effect on organizational operations, mission capabilities, assets, individuals, customers, or other organizations.",
        range_from: 15,
        range_to: 25,
        color: "#FF0000",
        source_type: 0,
      },
    ],
  };
}

export async function importRisk(file) {

  let formData = new FormData();
  formData.append('file', file)

  return await post("/risk/importrisk/", formData);
}

export async function exportRisk() {
  return await get("/risk/export/");
}

export async function createCategory(name) {
  return await post("/risk/categories/", { name })
}