import { get, post, put } from "./CrudFactory";

/* Method to get last/max id of passed data */
export function getLastIndex(data) {
  // Target a Column
  const col = data["POAM ID"];
  // Get exsisting id list
  const ids = Object.keys(col);

  // If there is no data, then return 0
  if (ids.length === 0) return 0;

  // Find MAX id
  const max = Math.max(...ids);
  return max;
}

/* Method to extract data of specified row */
export function getRowData(index, labels, data) {
  const temp = {};
  for (var name of labels) temp[name] = data[name][index];
  return temp;
}

/* Method to update poam row with new data */
export function updatePoam(data, newRowData, labels, index) {
  const temp = { ...data };
  for (var name of labels) temp[name][index] = newRowData[name][index];
  return temp;
}

/* Method to upload poam file */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return await post("/poam/addexcel", formData);
}

// Methods to get data from specific sheet
const getOpenData = async (id) => await get(`/poam/fetchopenexcel/${id}`);
const getCloseData = async (id) => await get(`/poam/fetchclosedexcel/${id}`);
/* Method to get POAM data from Open or close sheet */
export async function getData(open, id) {
  return await (open ? getOpenData(id) : getCloseData(id));
}

/* Method to add new row in OPEN sheet, based on row_index */
export async function addRow(size, data) {
  return await put("/poam/addrow", {
    new_row: data,
    row_index: Number(size),
  });
}

/* Method to update row in OPEN sheet, based on row_index */
export async function updateRow(rowIndex, data) {
  return await put("/poam/updaterow", {
    update_row: data,
    row_index: Number(rowIndex),
  });
}

/* Method to move data from OPEN Poam to CLOSE */
export async function moveToClose(rowIndex, data, id) {
  // Get new row index from close sheet
  const res = await getCloseData(id);
  if (!res.status) return res;
  console.log(res);
  const newIndex = getLastIndex(res.data.data) + 1;

  return await put(`/poam/movetoclosed/${id}`, {
    move_row: data,
    open_row_index: Number(rowIndex),
    closed_row_index: newIndex,
  });
}

/* Method to move data from CLOSE Poam to OPEN */
export async function moveToOpen(rowIndex, data, id) {
  // Get new row index from open sheet
  const res = await getOpenData(id);
  if (!res.status) return res;
  const newIndex = getLastIndex(res.data.data) + 1;

  return await put(`/poam/movetoopen/${id}`, {
    move_row: data,
    open_row_index: newIndex,
    closed_row_index: Number(rowIndex),
  });
}
