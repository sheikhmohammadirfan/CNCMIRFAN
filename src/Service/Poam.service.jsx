import { get, post, put } from "./CrudFactory";

/* Method to create new poam */
export async function createPoam(data) {
  return await post("/poam/createnew/", data);
}

/* Method to upload a poam file */
export async function uploadPoam(data) {
  const formData = new FormData();
  for (let key of Object.keys(data)) formData.append(key, data[key]);

  return await post("/poam/addexcel/", formData);
}

/* Method to get name of CSP */
export async function getCSP() {
  return await get("/poam/fetchcsp/");
}

/* Method to get POAM data from Open or close sheet */
export async function getData(id) {
  return await get(`/poam/fetchexcel/${id}`);
}

/* Method to get list of uploaded poams */
export async function getPoamList() {
  return await get("/poam/listpoam/");
}

/* Method to add new row in OPEN sheet, based on row_index */
export async function addRow(fileID, data, size) {
  return await put(`/poam/addrow/${fileID}/`, {
    new_row: data,
    row_index: Number(size),
  });
}

/* Method to update row in OPEN sheet, based on row_index */
export async function updateRow(fileID, data, rowIndex) {
  return await put(`/poam/updaterow/${fileID}/`, {
    update_row: data,
    row_index: Number(rowIndex),
  });
}

/* Method to move data from OPEN Poam to CLOSE */
async function moveToClose(fileID, data, rowIndex, newIndex) {
  return await put(`/poam/movetoclosed/${fileID}`, {
    move_row: data,
    open_row_index: Number(rowIndex),
    closed_row_index: newIndex,
  });
}
/* Method to move data from CLOSE Poam to OPEN */
async function moveToOpen(fileID, data, rowIndex, newIndex) {
  return await put(`/poam/movetoopen/${fileID}`, {
    move_row: data,
    open_row_index: newIndex,
    closed_row_index: Number(rowIndex),
  });
}
/* Method to move data */
export async function moveRow(fileID, data, isOpen, rowIndex, newIndex) {
  return await (isOpen
    ? moveToClose(fileID, data, rowIndex, newIndex)
    : moveToOpen(fileID, data, rowIndex, newIndex));
}
