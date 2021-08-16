import axios from "./app.service";

class Appservice {
    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file",file);

        return axios.post(
            "/file/addfile/64/izg0pi075c/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress,
            }
        );
    }

    getFiles() {
        return axios.get("/file");
    }
}

export default new Appservice();