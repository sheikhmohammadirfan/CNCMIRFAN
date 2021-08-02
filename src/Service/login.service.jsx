import { toast, Flip } from "react-toastify";
import axios from "./app.service";

class AppService {
  // Method to login user
  async login(email, password) {
    return axios
      .post("/auth/login", { email, password })
      .then((res) => {
        // Save JWT token
        localStorage.setItem("accessToken", res.data.accessToken);
        // Show toast
        toast("Welcome", {
          toastId: "login-toast",
          transition: Flip,
          type: "success",
        });
        // Return Success
        return true;
      })
      .catch((err) => {
        // Show Toast
        toast(err.response.data.message || "An error occured.", {
          toastId: "login-toast",
          transition: Flip,
          type: "error",
        });
        // Return faliure
        return false;
      });
  }
}

export default new AppService();
