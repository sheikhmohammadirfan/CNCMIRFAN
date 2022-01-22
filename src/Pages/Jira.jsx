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
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormTextInput from "../Components/Form/FormTextInput";
import FormTextArea from "../Components/Form/FormTextArea";
import FormDropdown from "../Components/Form/FormDropdown";
import FormAttachment from "../Components/Form/FormAttachment";
import DocumentTitle from "../Components/DocumentTitle";
import LinkJira from "../Components/Jira/LinkJira";
import FetchAssignee from "../Components/Jira/FetchAssignee";
import {
  fetchAssignee,
  fetchIssueTypes,
  fetchProjects,
  createIssue,
} from "../Service/Jira.service";
import { AvatarGroup } from "@material-ui/lab";
import UpdateIssue from "../Components/Jira/UpdateIssue";

const useStyles = makeStyles((theme) => ({
  popup: {
    zIndex: "10",
    height: "200px",
    padding: "0.5rem 1rem",
    position: "absolute",
    top: "3.2rem",
    left: "1rem",
    animation: `$myEffect 0.3s ${theme.transitions.easing.easeInOut}`,
    // transform: show ? "scaleX(1)" : "scaleX(0)",
    // transition: "transform 0.3s",
  },
  "@keyframes myEffect": {
    "0%": {
      transform: "scale(0)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  fileList: {
    "&:not(:last-of-type)": {
      marginRight: 4,
    },
  },
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
  const [show, setShow] = useState(false);
  const [project, setProject] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [loader, setLoader] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleClickOpen = async () => {
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
    setOpen(false);
    setIssueType([]);
    setProject([]);
    setOptions([]);
    setSelectedAssignee([]);
    reset();
  };

  const onSubmit = (data) => console.log(data);

  // const onSubmit = async (data) => {
  //   setLoader(true);
  //   const { status } = await createIssue(
  //     data.project,
  //     data.summary,
  //     data.description,
  //     data.issueType,
  //     selectedAssignee,
  //     data.fileUpload
  //   );
  //   if (!status) return;

  //   setIssueType([]);
  //   setProject([]);
  //   setOptions([]);
  //   setSelectedAssignee([]);
  //   setLoader(false);
  //   setOpen(false);
  //   reset();
  // };

  const assignee = () => {
    return (
      <div style={{ position: "relative" }}>
        <Typography>Assignee</Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            style={{
              border: "1px solid #aaa",
              // borderRadius: "6px",
              // boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
              marginRight: "2rem",
              fontSize: "1rem",
            }}
            onClick={async () => {
              setShow(!show);
              setLoading(true);
              if (show && options.length === 0) return;
              const { data, status } = await fetchAssignee(projectKey[0]);
              if (!status) return;
              setLoading(false);
              setOptions(data);
            }}
          >
            <Add />
          </IconButton>
          {selectedAssignee && (
            <div style={{ display: "flex" }} className="avatar">
              {selectedAssignee.map((assignee) => (
                <AvatarGroup max={4}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={assignee.displayName}
                  >
                    <Avatar
                      style={{ backgroundColor: "palegreen" }}
                      src={assignee.avatarUrls}
                    />
                  </Tooltip>
                </AvatarGroup>
              ))}
            </div>
          )}
        </div>
        <div
          // className={classes.popup}
          onBlur={() => setShow(false)}
          style={{
            zIndex: "10",
            opacity: "1",
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
            padding: "0.5rem 1rem",
            position: "absolute",
            top: "3.2rem",
            left: "1rem",
            transform: show ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.3s",
          }}
        >
          <Autocomplete
            id="assignee"
            freeSolo
            onChange={(event, value) => {
              if (!value) return;
              if (selectedAssignee.includes(value)) return;
              setSelectedAssignee([...selectedAssignee, value]);
            }}
            options={options}
            getOptionLabel={(option) => option.displayName}
            renderOption={(option) => (
              <React.Fragment key={option.id}>
                <Avatar src={option.avatarUrls} />
                {option.displayName}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...register("assignee")}
                {...params}
                label="assignee"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="primary" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            style={{ width: 270 }}
          />
        </div>
      </div>
    );
  };

  return (
    <Box component="div">
      <Backdrop style={{ zIndex: "100" }} open={loader}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <LinkJira />
      <UpdateIssue />
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Issue
      </Button>
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
            {/* {assignee()} */}
            <FetchAssignee
              name="assignee"
              label="Assignee"
              control={control}
              projectKey={projectKey[0]}
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
    </Box>
  );
}
