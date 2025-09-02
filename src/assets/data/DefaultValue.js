import { stringToMoment } from "../../Components/Utils/Utils";

export const CreateIssue = {
  project: "",
  summary: "",
  description: "",
  issuetype: "",
  // Empty string on assignee was resulting in the Select dropdown having a default empty value. So set to null here to prevent that
  assignee: null,
  labels: [],
  file: [],
};

export const LinkJira = {
  link: "",
  email: "",
  api_token: "",
};

export const UpdateIssue = {
  project: "",
  issue_key: "",
  issuetype: "",
  summary: "",
  description: "",
  reporter: null,
  assignee: null,
  labels: [],
  priority: "",
  customfield_10014: "",
  components: "",
  customfield_10020: "",
  duedate: null,
};

export const PoamUpload = {
  file: null,
  file_name: "",
  csp: "",
  system_name: "",
  agency_name: "",
};

export const DocumentSelect = {
  "Document Name": "",
  "Document Type": "Other",
  "Other Name": "",
};

export const Profile = (getUser) => ({
  email: getUser().email || "",
  first_name: getUser().first_name || "",
  last_name: getUser().last_name || "",
  contact_no: getUser().contact_no || "",
  // date_of_birth: stringToMoment(getUser().date_of_birth),
  // address: getUser().address || "",
  city: getUser().city || "",
  state: getUser().state || "",
  postal_code: getUser().postal_code || "",
  country: getUser().country || "",
  "New Password": "",
  "Confirm New Password": "",
});
