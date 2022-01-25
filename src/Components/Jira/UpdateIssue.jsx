import React, { useState, useEffect } from "react";
import {
  Box,
  Backdrop,
  Chip,
  Icon,
  TextField,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm } from "react-hook-form";
import { FormDateInput } from "../Form/FormDateInput";
import {
  fetchIssueTypes,
  fetchIssueDetails,
  updateIssue,
} from "../../Service/Jira.service";
import { useLocation } from "react-router-dom";
import FormTextInput from "../Form/FormTextInput";
import FormTextArea from "../Form/FormTextArea";
import FormDropdown from "../Form/FormDropdown";
import FormAttachment from "../Form/FormAttachment";
import FetchAssignee from "./FetchAssignee";
import { useParams } from "../Utils/Hooks/useParams";

const defaultValues = {
  description: "",
  issueType: "",
  summary: "",
  priority: "",
  attachment: [],
};

const temporary = [
  {
    label: "Low",
    value: "Low",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "High",
    value: "High",
  },
];

export default function UpdateIssue() {
  const [fetchedDetails, setFetchedDetails] = useState();
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, register, watch, control, setValue } = methods;
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [issues, seTIssues] = useState(false);
  const watcher = watch(["issueType", "assignee"]);
  const [components, setComponents] = useState([]);
  const [sprint, setSprint] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState([]);

  // const location = useLocation();
  // useEffect(() => {
  //   const urlSearchParams = new URLSearchParams(location.search);
  //   const params = Object.fromEntries(urlSearchParams.entries());
  //   setOpen(params.updateIssue === true);
  // }, [location]);

  const { getParams, deleteParams, location } = useParams();
  useEffect(() => {
    if (getParams().updateIssue === "true") {
      console.log("run");
      handleOpen();
    }
  }, [location]);

  useEffect(() => {
    if (fetchedDetails) {
      Object.entries(fetchedDetails).forEach(([name, value]) => {
        name === "sprint" ? setValue(name, value[0].id) : setValue(name, value);
      });
      setComponents(
        fetchedDetails.components.map((obj) => ({
          label: obj,
          value: obj,
        }))
      );
      setSprint(
        fetchedDetails.sprint.map((obj) => ({ label: obj.name, value: obj.id }))
      );
    }
  }, [fetchedDetails]);

  const handleOpen = async () => {
    setLoader(true);

    const { data, status } = await fetchIssueDetails();
    if (!status) return;

    setFetchedDetails({
      assignee: data.assignee,
      attachment: data.attachment,
      components: data.components,
      epicLink: data.customfield_10014,
      sprint: data.customfield_10020,
      description: data.description,
      duedate: data.duedate,
      issueType: data.issuetype,
      labels: data.labels,
      priority: data.priority,
      reporter: data.reporter,
      summary: data.summary,
      project: data.project,
    });

    const { data: issueData, status: issueStatus } = await fetchIssueTypes();
    if (!issueStatus) return;

    seTIssues(() => issueData.map((res) => ({ label: res, value: res })));
    setLoader(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    deleteParams("updateIssue");
    // console.log(fetchedDetails);
  };

  const onSubmit = async (fields) => {
    setLoader(true);

    const { data, status } = await updateIssue({
      ...fields,
      assignee: selectedAssignee[0],
    });
    setLoader(false);
    if (!status) return;
    setOpen(false);
  };

  return (
    <>
      <Backdrop style={{ zIndex: "100" }} open={loader}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={open}
        onClose={handleClose}
        style={{ zIndex: "99" }}
      >
        <DialogTitle>Update Issue</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <FormDropdown
              name="issueType"
              label="Issue Type *"
              control={control}
              options={issues}
              required={true}
            />

            <Box>
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
              <FormTextInput
                name="reporter"
                control={control}
                label="Reporter"
              />
              {/* <FetchAssignee
                  name="reporter"
                  label="Reporter"
                  control={control}
                  projectKey={fetchedDetails?.project || ""}
                  preAssigned={fetchedDetails?.reporter}
                  selectedElements={reporter}
                  setSelectedElements={setReporter}
                  multiple={false}
                /> */}

              <FormTextInput
                name="labels"
                control={control}
                label="Labels"
                required={true}
              />
              <FormDropdown
                name="priority"
                label="Priority"
                control={control}
                options={temporary}
                required={true}
              />

              <FetchAssignee
                name="assignee"
                label="Assignee"
                control={control}
                projectKey={fetchedDetails?.project || ""}
                preAssigned={fetchedDetails?.assignee}
                selectedElements={selectedAssignee}
                setSelectedElements={setSelectedAssignee}
              />

              <FormTextInput
                name="epicLink"
                control={control}
                label="Epic Link"
              />

              <FormDropdown
                name="components"
                label="Components"
                control={control}
                options={components}
                required={true}
              />

              <FormDropdown
                name="sprint"
                label="Sprint"
                control={control}
                options={sprint}
                required={true}
              />

              <FormDateInput
                name="duedate"
                label="Due Date"
                control={control}
              />
              <FormAttachment name="attachment" />
            </Box>
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
