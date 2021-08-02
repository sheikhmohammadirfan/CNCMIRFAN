import axios from "axios";

const instance = axios.create({
  baseURL: "https://cncm-backend.herokuapp.com",
});

export default instance;
