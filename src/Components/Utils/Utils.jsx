import { toast } from "react-toastify";

// Generate toast template
const ErrMsg = ({ data }) => (
  <div>
    {data.map((val, index) => (
      <div key={index}>{val}</div>
    ))}
  </div>
);
export const notification = (id, msg, type) =>
  toast(Array.isArray(msg) ? <ErrMsg data={msg} /> : msg, {
    toastId: id,
    type,
  });

// Method to deep copy an array/object
export function copyObject(originalValue) {
  let returnValue;

  if (Array.isArray(originalValue)) {
    returnValue = [];
    for (let value of originalValue) returnValue.push(copyObject(value));
  } else if (typeof originalValue === "object" && originalValue !== null) {
    returnValue = {};
    for (let key of Object.keys(originalValue))
      returnValue[key] = copyObject(originalValue[key]);
  } else returnValue = originalValue;

  return returnValue;
}

// Method to check if object is empty
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  return Object.keys(value).length === 0;
}

// Method to set element id element going in full screen
export const setFullScreenID = (state, id) => {
  if (state) localStorage.setItem("fullScreen", id);
};

// Object to be passed to Textfield to diable autocomplete
export const DisableAutoComplete = ({ inputProps, formProps } = {}) => ({
  inputProps: {
    autocomplete: "new-password",
    form: { autocomplete: "off", ...formProps },
    ...inputProps,
  },
});

// method to repalce/remove current query params
export const changeQueryParams = (params, removeAll) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const queryParams = Object.fromEntries(urlSearchParams.entries());
  const newParams = removeAll ? params : { ...queryParams, ...params };
  return new URLSearchParams(newParams);
};

// method to delete params from query parama string
export const deleteQueryParams = (...paramList) => {
  const query = new URLSearchParams(window.location.search);
  paramList.map((val) => query.delete(val));
  return query;
};

// method to check for valid password
export const isPasswordValid = (pass) => {
  // Check if password is not set
  if (pass === undefined) return true;
  // Check for number in password
  if (!pass.match(/\d/)) return "Password should atleast have a number.";
  // Check for lower case char in password
  if (!pass.match(/[a-z]/))
    return "Password should atleast have a small alphabet(a-z).";
  // Check for upper case char in password
  if (!pass.match(/[A-Z]/))
    return "Password should atleast have a Capital alphabet(A-Z).";
  // Check for symbols in password
  if (!pass.match(/[~`!@#$%^&*-+|<>,.?]/))
    return "Password should atleast have a Special character( ~`!@#$%^&*-+|<>,.?).";
  // Check for spaces in password
  if (pass.includes(" ")) return "Password cannot contain spaces in it.";
  // Check for password length
  if (pass.length < 8 || pass.length > 15)
    return "Password should have 8-15 characters.";
  return true;
};

// Get label, if single space is passed the return empty
export const getLabel = (label, name) => (label === " " ? "" : label || name);

// Get error message from error or control.error
export const getError = (error1, error2, gutter) =>
  error1 ? error1 : error2 ? error2.message : gutter ? " " : "";
