import { post, get, patch } from "./CrudFactory";

/* Method to link JIRA to user */
export async function linkWithJira(link, email, api_token) {
  return await post("/jira/register/", {
    link: link,
    email: email,
    api_token: api_token,
  });
}

/* Method to fetch all projects of user */
export async function fetchProjects() {
  return await get("/jira/fetchprojects/");
}

/* Method to fetch issue type list */
export async function fetchIssueTypes() {
  return await get("/jira/fetchissuetype/");
}

/* Method to fetch assignee list in project */
export async function fetchAssignee(key) {
  return await get(`/jira/fetchassignee/${key}`);
}

/* Method to fetch priority list */
export async function fetchPriority() {
  return await get(`/jira/fetchpriorities`);
}

/* Method to fetch list of the epic issues list */
export async function fetchEpicLink() {
  return await get(`/jira/fetchepiclink`);
}

/* Method to fetch component list in a particular project */
export async function fetchComponents(key) {
  return await get(`/jira/fetchcomponents/${key}`);
}

/* Method to fetch list of sprint available */
export async function fetchSprint() {
  return await get(`/jira/fetchsprint`);
}

/* Method to fetch issue details of the given issue */
export async function fetchIssueDetails(key) {
  return await get(`/jira/fetchissuedetails/${key}/`);
}

/* Method to create issue & link it to given poam row */
export async function createIssue(data, row_index, poamID) {
  // create formData obj
  const formData = new FormData();

  // Add row_index
  formData.append("row_index", row_index);

  // Add all value except assignee & file
  for (let key of Object.keys(data))
    if (!["file", "assignee"].includes(key)) formData.append(key, data[key]);

  // Check if any file is attached, then add for formData
  if (data.file.length > 0)
    for (let file of data.file) formData.append("file[]", file);

  // Check if any asignee is selected then, add it id
  if (data.assignee) formData.append("assignee", data.assignee.id);

  return await post(`/jira/newissue/${poamID}/`, formData);
}

/* Method to update issue with given details */
export async function updateIssue(data) {
  let formData = new FormData();

  // Append data to formdata
  for (let key of Object.keys(data)) {
    // avoid issuetye field
    if (key !== "issuetype") {
      // Check if any value is passed
      if (data[key]) {
        // Check if it is assignee or repoeter, then push their ids
        if (key === "assignee" || key === "reporter")
          formData.append(key, data[key].id);
        // else if key is dueDate, the convert it into same format
        else if (key === "duedate")
          formData.append(key, data[key]?.format("YYYY-MM-DD"));
        else formData.append(key, data[key]);
      }
    }
  }

  // make update request
  return await patch("/jira/updateissue/", formData);
}
