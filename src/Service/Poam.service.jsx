import { get, post, put } from "./CrudFactory";
import { poam_header_response_map } from "../assets/data/PoamData";

/* Method to create new POA&M */
export async function createPoam(data) {
  // As backend is accepting formData instead of JSON, we're making formData
  const formData = new FormData();
  for (let key of Object.keys(data)) formData.append(key, data[key]);

  return await post("/poam/createnew/", formData);
}

/* Method to upload a POA&M file */
export async function uploadPoam(data) {
  const formData = new FormData();
  for (let key of Object.keys(data)) formData.append(key, data[key]);

  return await post("/poam/addexcel/", formData);
}

/* Method to get name of CSP */
export async function getCSP() {
  return await get("/poam/fetchcsp/");
}

/* Method to get POA&M data from Open or close sheet */
export async function getData(id) {
  const res = await get(`/poam/fetchexcel/${id}`);

  // Mapping new response format to old
  const mapped_data = { open_data: {}, closed_data: {} };

  Object.values(poam_header_response_map).map((val, index) => {
    mapped_data.open_data[val] = []
    mapped_data.closed_data[val] = []
  })

  res.data.open_data.map((row, index) => {
    Object.keys(row).map((col, colIndex) => {
      mapped_data.open_data[poam_header_response_map[col]][index] = row[col];
    });
  });

  res.data.closed_data.map((row, index) => {
    Object.keys(row).map((col, colIndex) => {
      mapped_data.closed_data[poam_header_response_map[col]][index] = row[col];
    });
  });

  mapped_data["file_name"] = res.data.file_name;
  mapped_data["csp"] = res.data.csp;
  // changed from camelCase to snake_case because the file details popup in header expects snake_case
  mapped_data["system_name"] = res.data.system_name;
  mapped_data["agency_name"] = res.data.agency_name;

  return { data: mapped_data, status: res.status };
}

/* Method to get list of uploaded poams */
export async function getPoamList() {
  return await get("/poam/listpoam/");
}

/* Method to add new row in OPEN sheet, based on row_index */
export async function addRow(fileID, data, size) {
  // Jira issues not required in payload
  delete data.jira_issues;
  // Will always be true
  data["is_open"] = true;
  return await put(`/poam/addnewrow/${fileID}/`, {
    new_row: { ...data, poam_file: fileID },
    // row_index: Number(size),
  });
}

/* Method to update row in OPEN sheet, based on row_index */
export async function updateRow(fileID, data, rowIndex) {
  return await put(`/poam/updaterow/${fileID}/`, {
    update_row: data,
    // row_index: Number(rowIndex),
  });
}

/* Method to move data from OPEN POA&M to CLOSE */
async function moveToClose(fileID, data, rowIndex, newIndex) {
  return await put(`/poam/movetoclosed/${fileID}`, {
    move_row: data,
    open_row_index: Number(rowIndex),
    closed_row_index: newIndex,
  });
}
/* Method to move data from CLOSE POA&MM to OPEN */
async function moveToOpen(fileID, data, rowIndex, newIndex) {
  return await put(`/poam/movetoopen/${fileID}`, {
    move_row: data,
    open_row_index: newIndex,
    closed_row_index: Number(rowIndex),
  });
}
/* Method to move data */
export async function moveRow(fileID, data, isOpen, rowIndex, newIndex) {
  // The endpoint for movetoopen and movetoclose has merged on backend, so sending request from here only as this is common function for both operations
  return await put(`/poam/moveto/${fileID}`, {
    id: data.id,
  });

  // return await (isOpen
  //   ? moveToClose(fileID, data, rowIndex, newIndex)
  //   : moveToOpen(fileID, data, rowIndex, newIndex));
}

export async function getActions(options, signal) {
  return await post("/poam/tasks/", options, signal);
}

export async function exportAction() {
  return await get("/risk/tasks/export/");
}

export async function getControlsList() {
  return await get("/control/list-controls/");
}
