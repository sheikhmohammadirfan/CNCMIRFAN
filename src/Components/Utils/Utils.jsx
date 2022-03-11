import moment from "moment";
import { toast } from "react-toastify";

// Generate toast template
const ErrMsg = ({ data }) => (
  <ul style={{ paddingLeft: 20, margin: 0 }}>
    {data.map((val, index) => (
      <li key={index}>{val}</li>
    ))}
  </ul>
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

// method to check name props during prop-type checking
export const checkNameProps = (props, propName, componentName) => {
  if (props.controls && !props.name)
    return new Error(
      `Invalid prop name supplied to ${componentName}. Validation failed.`
    );
};

// Convert data to moment object
export const stringToMoment = (date) => {
  if (!date || date === "None") return null;
  return moment(date);
};

// replace jira id with names
export const replaceIdWithName = (val) => {
  const mapper = {
    issuetype: "Issue Type",
    summary: "Summary",
    description: "Description",
    reporter: "Reporter",
    assignee: "Assignnee",
    labels: "Labels",
    priority: "Priority",
    customfield_10014: "Epic Link",
    components: "Components",
    customfield_10020: "Sprint",
    duedate: "Due Date",
  };

  const mappedMessage = (value) => {
    let s = "";
    for (let keys in mapper)
      if (value.includes(keys)) {
        s = value.replaceAll(keys, mapper[keys]);
        break;
      }
    return s;
  };

  if (Array.isArray(val)) {
    let mappedArray = [];
    for (let i = 0; i < val.length; i++)
      mappedArray.push(mappedMessage(val[i]));
    return mappedArray;
  }

  return mappedMessage(val);
};
