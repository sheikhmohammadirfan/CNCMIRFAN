import { get, put } from "./CrudFactory";

async function getData() {
  return await get("/poam/fetchopenexcel");
}

async function updateRow(rowIndex, data) {
  return await put("/poam/updaterow", {
    update_row: data,
    row_index: rowIndex,
  });
}

async function addRow(size, data) {
  return await put("/poam/addrow", {
    update_row: data,
    row_index: size,
  });
}

export { getData, updateRow, addRow };
