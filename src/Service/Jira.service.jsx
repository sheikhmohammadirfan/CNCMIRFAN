import { post, get } from "./CrudFactory";
import { Iterate } from "../Components/Utils/Iterate";

export async function linkWithJira(link, email, api_token) {
  return await post("/jira/register/", {
    link: link,
    email: email,
    api_token: api_token,
  });
}

export async function fetchProjects() {
  return await get("/jira/fetchprojects/");
}

export async function fetchIssueTypes() {
  return await get("/jira/fetchissuetype/");
}

export async function fetchAssignee(key) {
  return await get(`/jira/fetchassignee/${key}`);
}

export async function createIssue(
  project,
  summary,
  description,
  issueType,
  assignee,
  files
) {
  let formData = new FormData();
  formData.append("project", project);
  formData.append("summary", summary);
  formData.append("description", description);
  formData.append("issuetype", issueType);
  formData.append("assignee", assignee[0].id);
  // if (assignee.length !== 0) {
  //   formData = Iterate(assignee, "assignee", formData);
  // }
  if (files.length !== 0) {
    formData = Iterate(files, "file[]", formData);
  }
  return await post("/jira/newissue/", formData);
}

export async function fetchIssueDetails() {
  return await get("/jira/fetchissuedetails/TJOF-4/");
}

export async function updateIssue({ ...updatedValues }) {
  let formData = new FormData();
  formData.append("issue_key", "TJOF-4");
  formData.append("assignee", updateIssue.assignee);
  formData.append("reporter", updateIssue.reporter);
  formData.append("components", updateIssue.components);
  formData.append("customfield_10014", updateIssue.epicLink);
  formData.append("customfield_10020", updateIssue.epicLink);
  return await post("/jira/updateissue/", formData);
}
