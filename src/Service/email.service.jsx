import { post } from "./CrudFactory";
import { Iterate } from "../Components/Utils/Iterate";

async function sendMail(subject, to, cc, bcc, message, files) {
  let formData = new FormData();
  // const iterate = (field, name) => {
  //   for (let i = 0; i < field.length; i++) {
  //     formData.append(name, field[i]);
  //   }
  // };

  formData.append("subject", subject);
  formData.append("body", message);
  formData = Iterate(to, "to[]", formData);
  formData = Iterate(cc, "cc[]", formData);
  formData = Iterate(bcc, "bcc[]", formData);
  formData = Iterate(files, "file[]", formData);
  return await post("/email/sendemail/", formData);
}

export default sendMail;
