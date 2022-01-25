import { post, get, patch } from "./CrudFactory";
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
  const { data, status } = await fetchAssignee(updatedValues.project);
  if (!status) return;
  const reporter = data.find((dt) => dt.displayName === updatedValues.reporter);

  let formData = new FormData();
  formData.append("issue_key", "TJOF-4");
  formData.append("assignee", updatedValues.assignee.id);
  formData.append("description", updatedValues.description);
  formData.append("summary", updatedValues.summary);
  formData.append("duedate", updatedValues.duedate);
  formData.append("reporter", reporter.id);
  formData.append("components", updatedValues.components);
  formData.append("labels", updatedValues.labels);
  formData.append("priority", updatedValues.priority);
  formData.append("customfield_10014", updatedValues.epicLink);
  formData.append("customfield_10020", updatedValues.sprint);
  return await patch("/jira/updateissue/", formData);
}
