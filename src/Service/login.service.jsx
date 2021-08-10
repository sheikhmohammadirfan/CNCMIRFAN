import { toast, Flip } from "react-toastify";
import axios from "./app.service";
import ErrMsg from "./ErrMsg";

class AppService {
  // Method to login user
  async login(email, password) {
    return axios
      .post("/user/login/", { email, password })
      .then((res) => {
        console.log(res);
        // Save JWT token
        localStorage.setItem("accessToken", res.data.token);
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
        // Parse error
        let errMsg;
        if (err.response.data)
          errMsg = () => <ErrMsg data={err.response.data} />;

        // Show Toast
        toast(errMsg || "An error occured.", {
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
