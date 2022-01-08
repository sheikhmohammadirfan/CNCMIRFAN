import { get, post, put } from "./CrudFactory";

// Method to get last/max id of passed data
function getLastIndex(data) {
  // Target a Column
  const col = data["POAM ID"];
  // Get exsisting id list
  const ids = Object.keys(col);

  // If there is no data, then return 0
  if (ids.length === []) return 0;

  // Find MAX id
  const max = Math.max(...ids);
  console.log(max);
  return max;
}

// Method to extract data of specified row
function getRowData(index, labels, data) {
  const temp = {};
  for (var name of labels) temp[name] = data[name][index];
  return temp;
}

// Method to update poam row with new data
function updatePoam(data, newRowData, labels, index) {
  const temp = { ...data };
  for (var name of labels) temp[name][index] = newRowData[name][index];
  return temp;
}

// Method to upload poam file
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return await post("/poam/addexcel", formData);
}

// Methods to get data from specific sheet
const getOpenData = async () => await get("/poam/fetchopenexcel");
const getCloseData = async () => await get("/poam/fetchclosedexcel");
// Method to get POAM data from Open or close sheet
async function getData(open) {
  return await (open ? getOpenData() : getCloseData());
}

// Method to update row in OPEN sheet, based on row_index
async function updateRow(rowIndex, data) {
  return await put("/poam/updaterow", {
    update_row: data,
    row_index: Number(rowIndex),
  });
}

// Method to add new row in OPEN sheet, based on row_index
async function addRow(size, data) {
  return await put("/poam/addrow", {
    new_row: data,
    row_index: Number(size),
  });
}

// Method to move data from OPEN Poam to CLOSE
async function moveToClose(rowIndex, data) {
  const res = await getCloseData();
  if (!res.status) return res;

  const newIndex = getLastIndex(res.data) + 1;

  return await put("/poam/movetoclosed", {
    move_row: data,
    open_row_index: Number(rowIndex),
    closed_row_index: newIndex,
  });
}

// Method to move data from CLOSE Poam to OPEN
async function moveToOpen(rowIndex, data) {
  const res = await getOpenData();
  if (!res.status) return res;

  const newIndex = getLastIndex(res.data) + 1;

  return await put("/poam/movetoopen", {
    move_row: data,
    open_row_index: newIndex,
    closed_row_index: Number(rowIndex),
  });
}

export {
  getLastIndex,
  getRowData,
  updatePoam,
  getData,
  uploadFile,
  updateRow,
  addRow,
  moveToClose,
  moveToOpen,
};
