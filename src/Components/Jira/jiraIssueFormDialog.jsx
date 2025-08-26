import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Icon,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// API imports
import {
  fetchProjects,
  fetchIssueTypes,
  fetchAssignee,
  createIssue,
} from "../../Service/Jira.service";
import { Autocomplete, MenuItem } from "@mui/material";
import FormikSelectAssignee from "./formikAssigneeList";

export default function JiraIssueDialog({ open, onClose, rowId }) {
  const [projectList, setProjectList] = useState([]);
  const [issueTypeList, setIssueTypeList] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);
  const [loading, setLoading] = useState({
    project: false,
    issuetype: false,
    assignee: false,
    submit: false,
  });

  const validationSchema = Yup.object({
    project: Yup.string().required("Project is required"),
    issuetype: Yup.string().required("Issue Type is required"),
    summary: Yup.string().required("Summary is required"),
    description: Yup.string().required("Description is required"),
    assignee: Yup.string().required("Assignee is required"),
  });

  const initialValues = {
    project: "",
    issuetype: "",
    summary: "",
    description: "",
    labels: "",
    assignee: "",
    file: null,
  };

  // Load project & issue type data when dialog opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading((l) => ({ ...l, project: true }));
      const { data: projects, status: projStatus } = await fetchProjects();
      if (projStatus) {
        setProjectList(projects.map((p) => ({ value: p.key, label: p.name })));
      }
      setLoading((l) => ({ ...l, project: false, issuetype: true }));

      const { data: issues, status: issueStatus } = await fetchIssueTypes();
      if (issueStatus) {
        setIssueTypeList(issues.map((i) => ({ value: i, label: i })));
      }
      setLoading((l) => ({ ...l, issuetype: false }));
    })();
  }, [open]);

  const handleProjectChange = async (projectKey) => {
    if (!projectKey) return;
    setLoading((l) => ({ ...l, assignee: true }));
    const { data: assignees, status } = await fetchAssignee(projectKey);
    if (status) {
      setAssigneeList(
        assignees.map((a) => ({
          value: a.id,
          label: a.displayName,
          avatarUrls: a.avatarUrls,
          emailAddress: a.emailAddress,
          is_falcon_user: a.is_falcon_user,
          is_active: a.is_active,
        }))
      );
    }
    setLoading((l) => ({ ...l, assignee: false }));
  };

  const handleSubmit = async (values) => {
    setLoading((l) => ({ ...l, submit: true }));
    const payload = {
      ...values,
      row_id: rowId,
    };
    // console.log("PAYLOAD", payload);
    // return;
    await createIssue(payload);
    setLoading((l) => ({ ...l, submit: false }));
    // setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle disableTypography>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Create Issue
        </Typography>
      </DialogTitle>

      <Formik
        enableReinitialize={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          touched,
          errors,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {/* Project Autocomplete */}
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={projectList}
                    getOptionLabel={(option) => option.label || ""}
                    loading={loading.project}
                    value={
                      projectList.find((opt) => opt.value === values.project) ||
                      null
                    }
                    onChange={(e, newValue) => {
                      setFieldValue("project", newValue ? newValue.value : "");
                      handleProjectChange(newValue ? newValue.value : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project"
                        variant="outlined"
                        error={touched.project && Boolean(errors.project)}
                        helperText={touched.project && errors.project}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading.project ? (
                                <CircularProgress size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Issue Type Autocomplete */}
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={issueTypeList}
                    getOptionLabel={(option) => option.label || ""}
                    loading={loading.issuetype}
                    value={
                      issueTypeList.find(
                        (opt) => opt.value === values.issuetype
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      setFieldValue("issuetype", newValue ? newValue.value : "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Issue Type"
                        variant="outlined"
                        error={touched.issuetype && Boolean(errors.issuetype)}
                        helperText={touched.issuetype && errors.issuetype}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading.issuetype ? (
                                <CircularProgress size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Summary */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    maxRows={3}
                    size="small"
                    name="summary"
                    label="Summary"
                    value={values.summary}
                    onChange={handleChange}
                    error={touched.summary && Boolean(errors.summary)}
                    helperText={touched.summary && errors.summary}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    minRows={4}
                    maxRows={10}
                    size="small"
                    name="description"
                    label="Description"
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Labels */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="labels"
                    label="Labels"
                    value={values.labels}
                    onChange={handleChange}
                    // helperText="Comma-separated labels"
                  />
                </Grid>

                {/* Assignee */}
                <Grid item xs={12}>
                  <Field
                    name="assignee"
                    label="Assignee"
                    component={FormikSelectAssignee}
                    options={assigneeList}
                    multiple={false} //for multi select
                  />
                </Grid>

                {/* File Upload */}
                <Grid item xs={12}>
                  <input
                    accept="*"
                    id="file-upload"
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      setFieldValue("file", event.currentTarget.files)
                    }
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Icon>attach_file</Icon>}
                      size="small"
                    >
                      Attachment
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClose}
                disabled={loading.submit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading.submit || isSubmitting}
              >
                {loading.submit ? "Submitting..." : "Create"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
