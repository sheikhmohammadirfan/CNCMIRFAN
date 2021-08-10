import axios from "axios";

const instance = axios.create({
  baseURL: "https://internassign.herokuapp.com/api",
});

export default instance;
