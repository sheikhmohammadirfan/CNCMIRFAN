import {post, get} from "./CrudFactory";
class Appservice {
    async upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file",file);
        return await post(
            "/file/addfile", formData, {
                onUploadProgress
            }
        );
    }

    async deleteFile(id) {
        return await post(
            "/file/deletefile/"+id 
        );
    }
    async getFiles() {
        return await get("/file");
    }
}

export default new Appservice();