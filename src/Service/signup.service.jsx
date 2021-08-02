import { toast, Flip } from "react-toastify";
import axios from "./app.service";

class AppService {
  // Method to sigin up user
  async signup(name, email, password) {
    return axios
      .post("/auth/signup", { name, email, password })
      .then((res) => {
        // Save user ID
        localStorage.setItem("accessToken", res.data);
        // Show toast
        toast("Registered Successfully", {
          toastId: "signup-toast",
          transition: Flip,
          type: "success",
        });
        // Return Success
        return true;
      })
      .catch((err) => {
        // Show Toast
        toast(err.response.data.message || "An error occured.", {
          toastId: "signup-toast",
          transition: Flip,
          type: "error",
        });
        // Return faliure
        return false;
      });
  }
}

export default new AppService();
