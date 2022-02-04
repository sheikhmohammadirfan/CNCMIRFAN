import { post, get } from "./CrudFactory";

/* Method to upload list of files to server */
export async function uploadFiles(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) formData.append("file", files[i]);
  return await post("/file/addfile", formData);
}

/* Method to delete list of files from server */
export async function deleteFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const { status } = await post("/file/deletefile/" + files[i].id);
    if (!status) return false;
  }
  return true;
}

/* Method to get uploaded files from server */
export async function getFiles() {
  return await get("/file");
}

/* Method to verify files */
export async function verifyFile(id, control = [], subcontrol = []) {
  return await get(`/file/verify/${id}/`, { control, subcontrol });
}
