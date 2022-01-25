import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Icon,
  TextField,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  CircularProgress,
  Avatar,
  Backdrop,
  Tooltip,
  Zoom,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm } from "react-hook-form";
import FormTextInput from "../Form/FormTextInput";
import FormTextArea from "../Form/FormTextArea";
import FormDropdown from "../Form/FormDropdown";
import FormAttachment from "../Form/FormAttachment";
import DocumentTitle from "../DocumentTitle";
import LinkJira from "./LinkJira";
import FetchAssignee from "./FetchAssignee";
import {
  fetchIssueTypes,
  fetchProjects,
  createIssue,
} from "../../Service/Jira.service";
import { useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  /** Classes **/
}));

const defaultValues = {
  description: "",
  issueType: "",
  project: "",
  summary: "",
  assignee: [],
  fileUpload: [],
};

export default function Jira({ title }) {
  DocumentTitle(title);
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, register, control, watch } = methods;
  const projectKey = watch(["project", "assignee"]);
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [loader, setLoader] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    setOpen(params.createIssue === "true");
    console.log("create");
  }, [location]);

  useEffect(() => {
    if (open === true) fetch();
  }, [open]);

  const fetch = async () => {
    setLoader(true);

    const { data, status } = await fetchProjects();
    if (!status) return;
    const { data: issueData, status: issueStatus } = await fetchIssueTypes();
    if (!issueStatus) return;

    setProject(() => data.map((res) => ({ label: res.name, value: res.key })));

    setIssueType(() => issueData.map((res) => ({ label: res, value: res })));
    setLoader(false);
    setOpen(true);
  };

  const handleClose = () => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    urlSearchParams.delete("createIssue");
    history.replace({
      search: urlSearchParams.toString(),
    });
    setOpen(false);
    setIssueType([]);
    setProject([]);
    setOptions([]);
    setSelectedAssignee([]);
    reset();
  };

  const onSubmit = async (data) => {
    setLoader(true);
    const { status } = await createIssue(
      data.project,
      data.summary,
      data.description,
      data.issueType,
      selectedAssignee,
      data.fileUpload
    );
    if (!status) return;

    setIssueType([]);
    setProject([]);
    setOptions([]);
    setSelectedAssignee([]);
    setLoader(false);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Backdrop style={{ zIndex: "100" }} open={loader}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{ zIndex: "99" }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Issue</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create Jira issues in an instant
          </DialogContentText>
          <FormProvider {...methods}>
            <FormDropdown
              name="project"
              label="Project *"
              control={control}
              options={project}
              required={true}
            />
            <FormDropdown
              name="issueType"
              label="Issue Type *"
              control={control}
              options={issueType}
              required={true}
            />
            <FetchAssignee
              name="assignee"
              label="Assignee"
              control={control}
              projectKey={projectKey[0]}
              selectedElements={selectedAssignee}
              setSelectedElements={selectedAssignee}
            />
            <FormTextInput
              name="summary"
              control={control}
              label="Summary"
              required={true}
            />
            <FormTextArea
              name="description"
              control={control}
              label="Description"
              required={true}
            />
            <FormAttachment name="fileUpload" />
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
