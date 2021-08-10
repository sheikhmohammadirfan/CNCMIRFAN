import { toast, Flip } from "react-toastify";
import axios from "./app.service";
import ErrMsg from "./ErrMsg";

class AppService {
  // Method to sigin up user
  async signup(name, email, password) {
    return axios
      .post("/user/", { name, email, password })
      .then((res) => {  
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
        // Parse error
        let errMsg;
        if (err.response.data) 
          errMsg = () => <ErrMsg data={err.response.data} />;
        
        // Show Toast
        toast(errMsg || "An error occured.", {
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
