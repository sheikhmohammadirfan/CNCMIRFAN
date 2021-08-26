import { post, get } from "./CrudFactory";

async function uploadFiles(files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) formData.append("file", files[i]);
  return await post("/file/addfile", formData);
}

async function deleteFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const { status } = await post("/file/deletefile/" + files[i].id);
    if (!status) return false;
  }
  return true;
}
async function getFiles() {
  return await get("/file");
}

export { uploadFiles, deleteFiles, getFiles };
