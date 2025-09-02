import DocumentTitle from "../DocumentTitle";
import { Button, Grid, Typography, Divider } from "@material-ui/core";
import { getIntegratedPlatform } from "../../Service/UserFactory";
import DialogBox from "../Utils/DialogBox";
import useLoading from "../Utils/Hooks/useLoading";
import {
  notification,
  replaceIdWithName,
  stringToMoment,
} from "../Utils/Utils";
import {
  DateControl,
  Form,
  SelectControl,
  TextControl,
} from "../Utils/Control";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  fetchAssignee,
  fetchComponents,
  fetchEpicLink,
  fetchIssueDetails,
  fetchIssueTypes,
  fetchPriority,
  fetchSprint,
  updateIssue,
} from "../../Service/Jira.service";
import { useState } from "react";
import SelectAssignee from "./SelectAssignee";
import SelectLabels from "./SelectLabels";
import { UpdateIssue as defaultValues } from "../../assets/data/DefaultValue";

// Status text based on loading value
const LoadingStatus = (loading) => ({
  prop: {
    style: { flexGrow: 1, fontStyle: "italic", paddingLeft: 8 },
  },
  element: (
    <Typography noWrap>
      {loading("fetchingIssue")
        ? "Fetching Issue..."
        : loading("issueType")
          ? "Loading Issue type..."
          : loading("assignee")
            ? "Loading Assignee..."
            : loading("priority")
              ? "Loading Priority..."
              : loading("customfield_10014")
                ? "Loading Epic Link..."
                : loading("components")
                  ? "Loading Components..."
                  : loading("customfield_10020")
                    ? "Loading Sprint..."
                    : loading("submit")
                      ? "Submiting data..."
                      : ""}
    </Typography>
  ),
});

/* UPDATE ISSUE */
function UpdateIssue({ title, close, issues }) {
  // Update title of document
  DocumentTitle(title);
  // List of issue id
  const issueIDs = Object.keys(issues);

  // State of options list
  const [issueTypeList, setIssueTypeList] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [epicList, setEpicList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [sprintList, setSprintList] = useState([]);

  // Get loading status
  const { isLoading, startLoading, stopLoading, updateLoading } = useLoading({
    fetchingIssue: false,
    issueType: false,
    assignee: false,
    priority: false,
    customfield_10014: false,
    components: false,
    customfield_10020: false,
    submit: false,
  });

  // Apply validation on jira fields
  const validation = {
    issue_key: {
      required: issueIDs.length === 1 || "This field is required.",
    },
    summary: { required: "This field is required." },
    description: { required: "This field is required." },
  };

  // Get methods of useForm
  const { handleSubmit, control, watch, setValue, getValues } = useForm({
    defaultValues,
  });
  // Watch issue to fetch issue details
  const issueWatcher = watch("issue_key");

  /* Method to fetch issue data of given issue id */
  const fetchIssueData = async (issueId) => {
    startLoading("fetchingIssue");
    const { data, status } = await fetchIssueDetails(issueId);
    stopLoading("fetchingIssue");
    return { data, status };
  };

  /* Method to populate fetched issue-data to form */
  const setIssueDetails = async (issueData, newAssigneeList) => {
    for (let key of Object.keys(defaultValues)) {
      // Set Assignee from person names
      if (["reporter", "assignee"].includes(key))
        setValue(
          key,
          // Check if assignee list is updated or not
          (newAssigneeList || assigneeList).find(
            (val) => val.displayName === issueData[key]
          )
        );
      // Set duedate, if none is passed then set null
      else if (key === "duedate") setValue(key, stringToMoment(issueData[key]));
      // Set Other value except issue_key
      else if (key !== "issue_key")
        setValue(key, issueData[key] !== "None" ? issueData[key] : "");
    }
  };

  /* Method to fetch all option list of given select issue project */
  const fetchOptionList = async (issueDetails) => {
    // Get list of issue type
    startLoading("issueType");
    const { data: issueData, status: issueStatus } = await fetchIssueTypes();
    if (!issueStatus) return stopLoading();
    setIssueTypeList(issueData);

    // Get list of assignees
    updateLoading({ assignee: true, issueType: false });
    const { data: assigneeData, status: assigneeStatus } = await fetchAssignee(
      issueDetails.project
    );
    if (!assigneeStatus) return stopLoading();
    setAssigneeList(assigneeData);

    // Get list of priority
    updateLoading({ priority: true, assignee: false });
    const { data: priorityData, status: priorityStatus } =
      await fetchPriority();
    if (!priorityStatus) return stopLoading();
    setPriorityList(priorityData);

    // Get list of epic link
    updateLoading({ customfield_10014: true, priority: false });
    const { data: epicData, status: epicStatus } = await fetchEpicLink();
    if (!epicStatus) return stopLoading();
    setEpicList(epicData.map((val) => ({ val: val.id, text: val.summary })));

    // Get list of component
    updateLoading({ components: true, customfield_10014: false });
    const { data: componentData, status: componentStatus } =
      await fetchComponents(issueDetails.project);
    if (!componentStatus) return stopLoading();
    setComponentList(componentData);

    // Get list of sprint
    updateLoading({ customfield_10020: true, components: false });
    const { data: sprintData, status: sprintStatus } = await fetchSprint();
    if (!sprintStatus) return stopLoading();
    setSprintList(sprintData.map((val) => ({ val: String(val.id), text: val.name })));
    stopLoading();

    return assigneeData;
  };

  // Onmounting component check if contains only one issue, then fetch them directly
  useEffect(() => {
    if (issueIDs.length === 1) setValue("issue_key", issueIDs[0]);
  }, []);

  // Fetch issue details & options list
  useEffect(() => {
    (async () => {
      // Fetch issue detail if selected issue is changed
      if (issueWatcher) {
        const { data, status } = await fetchIssueData(issueWatcher);
        if (status) {
          // save the update assignee value
          let newAssigneeList;
          // Check if selecte issue is of diffrent project, then fetch options again
          if (data.project !== getValues("project"))
            newAssigneeList = await fetchOptionList(data);
          // Update fields
          setIssueDetails(data, newAssigneeList);
        }
      }
    })();
  }, [issueWatcher]);

  // Method to submit data to create an issue
  const onSubmit = async (formDetails) => {
    startLoading("submit");
    const { message, status } = await updateIssue(formDetails);
    notification(
      "jira-issue",
      replaceIdWithName(message),
      status ? "success" : "error"
    );
    if (!status) return stopLoading();
    close();
    stopLoading();
  };

  return (
    <DialogBox
      open={true}
      maxWidth="sm"
      fullWidth
      loading={isLoading()}
      bottomSeperator={true}
      title={
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Update Issue
        </Typography>
      }
      contentProp={{ style: { padding: 16 } }}
      content={
        <Form
          // preventDefault to prevent form from submitting on any Enter presses
          onSubmit={(e) => e.preventDefault()}
          control={control}
          rules={validation}>
          <Grid container spacing={2}>
            {issueIDs.length > 1 && (
              <Grid item xs={7}>
                <SelectControl
                  name="issue_key"
                  label="Issue"
                  variant="outlined"
                  options={issueIDs}
                  disabled={isLoading("fetchingIssue")}
                  styleProps={{ fullWidth: true, size: "small" }}
                />
              </Grid>
            )}
            {(issueWatcher || issueIDs.length === 1) && (
              <>
                {issueIDs.length !== 1 && (
                  <Grid item xs={12}>
                    <Divider style={{ height: 4 }} />
                  </Grid>
                )}

                <Grid item xs={7}>
                  <SelectControl
                    name="issuetype"
                    label="Issue Type"
                    variant="outlined"
                    options={issueTypeList}
                    loading={isLoading("issueType")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextControl
                    variant="outlined"
                    name="summary"
                    label="Summary"
                    size="small"
                    fullWidth
                    multiline
                    gutter={false}
                    maxRows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextControl
                    variant="outlined"
                    name="description"
                    label="Description"
                    size="small"
                    fullWidth
                    multiline
                    gutter={false}
                    maxRows={10}
                    minRows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectAssignee
                    name="reporter"
                    label="Reporter"
                    control={control}
                    rules={validation}
                    options={assigneeList}
                    loading={isLoading("assignee")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectAssignee
                    name="assignee"
                    label="Assignee"
                    control={control}
                    rules={validation}
                    options={assigneeList}
                    loading={isLoading("assignee")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectLabels
                    name="labels"
                    label="Labels"
                    control={control}
                    rules={validation}
                  />
                </Grid>

                <Grid item xs={7}>
                  <SelectControl
                    name="priority"
                    label="Priority"
                    variant="outlined"
                    options={priorityList}
                    loading={isLoading("priority")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>

                <Grid item xs={7}>
                  <SelectControl
                    name="customfield_10014"
                    label="Epic Link"
                    variant="outlined"
                    options={epicList}
                    loading={isLoading("customfield_10014")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>

                <Grid item xs={7}>
                  <SelectControl
                    name="components"
                    label="Component"
                    variant="outlined"
                    options={componentList}
                    loading={isLoading("components")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>

                <Grid item xs={7}>
                  <SelectControl
                    name="customfield_10020"
                    label="Sprint"
                    variant="outlined"
                    options={sprintList}
                    loading={isLoading("customfield_10020")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>

                <Grid item xs={7}>
                  <DateControl
                    name="duedate"
                    label="Due Date"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Form>
      }
      actions={[
        LoadingStatus(isLoading),
        <Button
          color="secondary"
          onClick={close}
          variant="outlined"
          disabled={isLoading("submit", "fetchingIssue")}
        >
          Cancel
        </Button>,
        <Button
          type="submit"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading("submit", "fetchingIssue")}
        >
          Update
        </Button>,
      ]}
    />
  );
}

/* UPDATE JIRA ISSUE CONTAINER */
export default function UpdateIssueWrapper({ title, queryParams, close }) {
  // Check if jira is connected, else unmount component
  const checkJiraIntegration = () => {
    const integrationStatus = getIntegratedPlatform().jira;
    if (!integrationStatus) {
      notification("jira-issue", "No jira account is connected.", "error");
      close();
      return false;
    }
    return true;
  };
  if (!checkJiraIntegration()) return null;

  return (
    <UpdateIssue
      title={title}
      issues={JSON.parse(queryParams.issues || "{}")}
      close={close}
    />
  );
}
