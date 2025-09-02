import React, { useState, useEffect } from "react";
import { Button, Typography, Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import DocumentTitle from "../DocumentTitle";
import SelectAssignee from "./SelectAssignee";
import {
  fetchIssueTypes,
  fetchProjects,
  createIssue,
  fetchAssignee,
} from "../../Service/Jira.service";
import useParams from "../Utils/Hooks/useParams";
import useLoading from "../Utils/Hooks/useLoading";
import DialogBox from "../Utils/DialogBox";
import {
  Form,
  SelectControl,
  TextControl,
  UploadControl,
} from "../Utils/Control";
import { notification, replaceIdWithName } from "../Utils/Utils";
import { getIntegratedPlatform } from "../../Service/UserFactory";
import SelectLabels from "./SelectLabels";
import { CreateIssue as defaultValues } from "../../assets/data/DefaultValue";

// Status text based on loading value
const LoadingStatus = (loading) => ({
  prop: {
    style: { flexGrow: 1, fontStyle: "italic", paddingLeft: 8 },
  },
  element: (
    <Typography noWrap>
      {loading("project")
        ? "Loading Project..."
        : loading("issuetype")
        ? "Loading Issue type..."
        : loading("assignee")
        ? "Loading Assignees..."
        : loading("submit")
        ? "Submiting data..."
        : ""}
    </Typography>
  ),
});

/* CREATE ISSUE */
// Added rowId in params and destructuring it here. It is done to send it in /createissue payload
function CreateIssue({ title, poamID, close, rowIndex, rowId }) {
  DocumentTitle(title);

  // State to update option list
  const [projectList, setProject] = useState([]);
  const [issueTypeList, setIssueType] = useState([]);
  const [assigneeList, setAssignee] = useState([]);

  // Get loading status
  const { isLoading, startLoading, stopLoading, updateLoading } = useLoading({
    project: false,
    issuetype: false,
    assignee: false,
    submit: false,
  });

  // Apply validation on jira fields
  const validation = {
    project: { required: "This field is required." },
    summary: { required: "This field is required." },
    description: { required: "This field is required." },
    issuetype: { required: "This field is required." },
    assignee: { required: "This field is required." },
  };

  // Get methods of useForm
  const { handleSubmit, control, watch, setValue } = useForm({ defaultValues });
  // Watch project to update assignee option list
  const projectWatcher = watch("project");

  // Fetch project & issuetype on mounting component
  useEffect(() => {
    // Fetch project types on mounting component
    (async () => {
      startLoading("project");
      // Get project list
      const { data: projectList, status: projectStatus } =
        await fetchProjects();
      if (!projectStatus) return stopLoading();
      // Update dropdown options
      setProject(
        projectList.map((project) => ({ val: project.key, text: project.name }))
      );

      updateLoading({ project: false, issuetype: true });
      // Get issue type list
      const { data: issueTypeList, status: issueTypeStatus } =
        await fetchIssueTypes();
      if (!issueTypeStatus) return stopLoading();

      setIssueType(issueTypeList);
      stopLoading("issuetype");
    })();
  }, []);

  // Fetch assginee on project key change
  useEffect(() => {
    if (projectWatcher !== "") {
      (async () => {
        startLoading("assignee");
        // Fetch assginee only if project is selected
        const { data, status } = await fetchAssignee(projectWatcher);
        if (!status) return stopLoading();
        setAssignee(data);
        stopLoading("assignee");
      })();
    }
  }, [projectWatcher]);

  // Method to submit data to create an issue
  const onSubmit = async (formDetails) => {
    const labels = formDetails.labels.join(",");
    const payload = {
      project: formDetails.project,
      row_id: rowId,
      summary: formDetails.summary,
      description: formDetails.description,
      issuetype: formDetails.issuetype,
      assignee: formDetails.assignee.id,
      labels: labels,
      file: formDetails.file,
    };

    startLoading("submit");
    const { message, status } = await createIssue(
      payload
      // rowIndex,
      // poamID
    );
    notification(
      "jira-issue",
      status ? message : replaceIdWithName(message),
      status ? "success" : "error"
    );
    if (!status) return stopLoading();
    stopLoading();
    close(message.split(" ")[0]);
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
          Create Issue
        </Typography>
      }
      contentProp={{ style: { padding: 16 } }}
      content={
        <Form
          // preventDefault to prevent form from submitting on any Enter presses
          onSubmit={(e) => e.preventDefault()}
          control={control}
          rules={validation}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectControl
                name="project"
                label="Project"
                variant="outlined"
                options={projectList}
                loading={isLoading("project")}
                styleProps={{ fullWidth: true, size: "small" }}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <SelectControl
                    name="issuetype"
                    label="Issue Type"
                    variant="outlined"
                    options={issueTypeList}
                    loading={isLoading("issuetype")}
                    styleProps={{ fullWidth: true, size: "small" }}
                  />
                </Grid>
              </Grid>
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
              <SelectLabels
                name="labels"
                label="Labels"
                control={control}
                rules={validation}
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
                sx={{
                  "& .MuiDialog-root": {
                    zIndex: "13000",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <UploadControl name="file" multiple />
            </Grid>
          </Grid>
        </Form>
      }
      actions={[
        LoadingStatus(isLoading),
        <Button
          color="secondary"
          onClick={() => close()}
          variant="outlined"
          disabled={isLoading("submit")}
        >
          Cancel
        </Button>,
        <Button
          type="submit"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading("submit")}
        >
          Create
        </Button>,
      ]}
    />
  );
}

/* CREATE JIRA ISSUE CONTAINER */
export default function CreateIssueWrapper({ title, queryParams, close }) {
  // Get params access
  const { getParams, changeParams, deleteParams } = useParams();

  // onClosing check if issueid is passed
  const handleClose = (issueId) => {
    if (issueId) changeParams({ issueId });
    deleteParams("rowIndex");
    close();
  };

  // Check if jira is connected, else unmount component
  const checkJiraIntegration = () => {
    const integrationStatus = getIntegratedPlatform().jira;
    if (!integrationStatus) {
      notification("jira-issue", "No jira account is connected.", "error");
      handleClose();
      return false;
    }
    return true;
  };
  if (!checkJiraIntegration()) return null;

  return (
    <CreateIssue
      title={title}
      poamID={getParams().file}
      rowIndex={queryParams.rowIndex}
      rowId={queryParams.rowId}
      close={handleClose}
    />
  );
}
