import {
  Typography,
  Box,
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItem,
  makeStyles,
  IconButton,
  Icon,
  Tooltip,
  Backdrop,
  CircularProgress,
  Chip,
} from "@material-ui/core";
import React from "react";
import {
  getData,
  createPoam as createNewPoam,
  getPoamList,
  getCSP,
  uploadPoam,
} from "../../Service/Poam.service";
import useLoading from "../Utils/Hooks/useLoading";
import { useState } from "react";
import { hidden_columns, poam_header } from "../../assets/data/PoamData";
import DownloadPoam from "./DownloadPoam";
import DialogBox from "../Utils/DialogBox";
import { Form, TextControl, UploadControl } from "../Utils/Control";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PoamUpload as defaultValues } from "../../assets/data/DefaultValue";

// Generate styles
const useStyle = makeStyles((theme) => ({
  // style for list title
  titleStyle: {
    fontWeight: "bold",
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },

  // style for list container
  listContainer: { padding: `0 ${theme.spacing(1 / 2)}px`, overflow: "hidden" },

  // Style for list item
  listItem: {
    margin: "12px 0",
    borderRadius: 4,
    border: "1px solid rgba(0, 0, 0, 0.2)",
    transition: "all 0.1s linear",
    "& .MuiIconButton-root": {
      padding: 0,
      overflow: "hidden",
      width: 0,
      transition: "all 0.1s linear",
    },
    "&:hover": {
      borderColor: "black",
      background: "transparent",
      boxShadow: theme.shadows[1],
      "& .MuiIconButton-root": { padding: "0 3px", width: 24 },
    },
  },

  // Style for drag content element
  dragContent: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.grey[400],
    fontSize: "1.2rem",
    fontWeight: "bold",
    transition: "all 0.2s linear",
    cursor: "pointer",
    "&[drag-active=true], &[drag-above=true]": {
      color: theme.palette.grey[600],
      background: "rgba(150, 200, 200, 0.2)",
      border: "1px solid white",
    },
    "&[drag-active=true][drag-above=false]": { "--color": "50, 150, 150" },
  },

  // Upload Button
  fileUploadBtn: {
    padding: theme.spacing(3 / 4),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    "&[error='true']": {
      color: "#f44336",
      background: theme.palette.grey[100],
      border: `1px solid ${theme.palette.grey[300]}`,
    },
  },

  // Backdrop style
  backdrop: {
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    color: "white",
    "&  .backdrop-label": {
      marginTop: 10,
      fontWeight: "bold",
      letterSpacing: 1,
      fontStyle: "italic",
    },
  },
}));

/* DIALOG TO ADD/CREATE NEW POAM */
const AddNewPoamDialog = ({
  isOpen,
  close,
  isCreate,
  loading: { isLoading, startLoading, stopLoading },
  selectFile,
  cspName,
}) => {
  const classes = useStyle();

  // Check if csp name is passed, then set it
  if (cspName) defaultValues.csp = cspName;

  // Field validations
  const validation = {
    file: {
      validate: {
        valid: (val) => isCreate() || val !== null || "This field is required.",
      },
    },
    file_name: {
      validate: {
        valid: (val) => {
          if (!isCreate()) return true;
          if (!val) return "This field is required.";
          if (val.length < 4)
            return "File name should have atleast 4 characters.";
          if (!val.match(/\.xls(x|m)$/i))
            return "File name should ends with .xlsx or .xlsm";
        },
      },
    },
    csp: {
      required: "This field is required.",
      minLength: {
        value: 4,
        message: "CSP Name should have atleast 4 characters.",
      },
    },
    system_name: {
      required: "This field is required.",
      minLength: {
        value: 4,
        message: "System name should have atleast 4 characters.",
      },
    },
    agency_name: {
      required: "This field is required.",
      minLength: {
        value: 4,
        message: "Agency name should have atleast 4 characters.",
      },
    },
  };

  // Get form object
  const { handleSubmit, control, watch, setValue, formState } = useForm({
    defaultValues,
  });
  const watchFile = watch("file");

  // Make create api call with onsubmitting form
  const onSubmit = async (formData) => {
    startLoading();
    const { data, status } = await (isCreate()
      ? createNewPoam(formData)
      : uploadPoam(formData));
    if (!status) return stopLoading();
    close();
    selectFile(data.file_id);
    stopLoading();
  };

  // Drag container element
  const Container = (child) => (
    <Box width={1} height={1}>
      {child}
    </Box>
  );

  // Drag content element
  const Content = (isDragActive, isDragAbove, error) => (
    <Box
      className={`${classes.dragContent} pulse`}
      drag-active={String(isDragActive)}
      drag-above={String(isDragAbove)}
    >
      {watchFile ? (
        <Chip
          label={watchFile.name}
          style={{ overflow: "hidden" }}
          onDelete={() => setValue("file", null)}
        />
      ) : (
        <span
          className={classes.fileUploadBtn}
          error={Boolean(error).toString()}
        >
          {error ? "File is required !" : "Drag n Drop"}
          <br />
        </span>
      )}
    </Box>
  );

  return (
    <DialogBox
      open={isOpen}
      onClose={close}
      title={isCreate() ? "Create New Poam" : "Add New Poam"}
      maxWidth={isCreate() ? "xs" : "sm"}
      fullWidth
      bottomSeperator={true}
      loading={isLoading()}
      content={
        <Box marginY={2}>
          <Form control={control} rules={validation}>
            <Grid container spacing={1}>
              <Grid item xs={isCreate() ? 12 : 7}>
                <Grid container spacing={2}>
                  {isCreate() && (
                    <Grid item xs={12}>
                      <TextControl
                        variant="outlined"
                        name="file_name"
                        label="File Name"
                        size="small"
                        fullWidth
                        gutter={false}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextControl
                      variant="outlined"
                      name="csp"
                      label="CSP Name"
                      size="small"
                      fullWidth
                      disabled={Boolean(cspName)}
                      gutter={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextControl
                      variant="outlined"
                      name="system_name"
                      label="System Name"
                      size="small"
                      fullWidth
                      gutter={false}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextControl
                      variant="outlined"
                      name="agency_name"
                      label="Agency Name"
                      size="small"
                      fullWidth
                      gutter={false}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {!isCreate() && (
                <Grid item xs={5}>
                  <UploadControl
                    name="file"
                    multiple={false}
                    hideButtons={true}
                    hideFileList={true}
                    hideDragNDrop={false}
                    dragContainer={Container}
                    dragContent={(active, above) =>
                      Content(active, above, formState.errors.file)
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Form>
        </Box>
      }
      actions={[
        <Button variant="outlined" color="secondary" onClick={close}>
          Cancel
        </Button>,
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onSubmit)}
        >
          {isCreate() ? "Create" : "Add"}
        </Button>,
      ]}
    />
  );
};

/* COMPONENT FORM ITEM OF POAM LIST */
const PoamListItem = ({ text, children, iconTooltip = "", ...rest }) => (
  <ListItem button disableRipple className={useStyle().listItem} {...rest}>
    <Typography noWrap style={{ flexGrow: 1 }}>
      {text}
    </Typography>
    {children && (
      <Tooltip arrow title={iconTooltip}>
        {children}
      </Tooltip>
    )}
  </ListItem>
);

/* ROOT UPLOAD COMPONENT */
export default function PoamUpload({ selectFile }) {
  // Get css styles
  const classes = useStyle();

  // Manage add new poam dialog status
  const [dialogOpen, setDialogOpen] = useState(-1);
  const isDialogOpen = () => dialogOpen !== -1;
  const isCreateDialog = () => dialogOpen === 1;
  const isUploadDialog = () => dialogOpen === 0;
  const openCreateDialog = () => setDialogOpen(1);
  const openUploadDialog = () => setDialogOpen(0);
  const closeDialog = () => setDialogOpen(-1);

  // State to save api data
  const [cspName, setCspName] = useState("");
  const [poamList, setPoamList] = useState({});

  // State to save download props
  const [downloadPoamProps, setDownloadPoamProps] = useState();

  // Loader state
  const { isLoading, startLoading, stopLoading } = useLoading({
    download: false,
    upload: false,
    load: false,
  });

  // fetch poam list on component mount
  useEffect(() => {
    (async () => {
      startLoading("load");
      const { data, status } = await getPoamList();
      if (!status) return stopLoading("load");
      setPoamList(data);

      const res = await getCSP();
      if (!res.status) return;
      if (res.data.csp) setCspName(res.data.csp);

      stopLoading("load");
    })();
  }, []);

  // Method to sow download dialog to download file
  const downloadPoam = async (e, val) => {
    e.stopPropagation();

    startLoading("download");
    const { data, status } = await getData(val);
    if (!status) return stopLoading("download");

    setDownloadPoamProps({
      data: { open: data.open_data, close: data.closed_data },
      poamID: val,
      close: () => setDownloadPoamProps(),
      allColumns: poam_header,
      hiddenColumns: hidden_columns,
    });

    stopLoading("download");
  };

  return (
    <Box
      height="80vh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box width="60%" maxWidth={400}>
        <Typography noWrap variant="h6" className={classes.titleStyle}>
          List of Poam files
        </Typography>

        <List disablePadding className={classes.listContainer}>
          {isLoading("load") ? (
            <PoamListItem text="Loading..." disabled>
              <CircularProgress size={20} color="inherit" />
            </PoamListItem>
          ) : Object.values(poamList).length === 0 ? (
            <PoamListItem disabled text="NO POAM FILE" />
          ) : (
            Object.keys(poamList).map((val, index) => (
              <PoamListItem
                key={index}
                text={poamList[val]}
                iconTooltip="Download file"
                onClick={() => selectFile(val)}
              >
                <IconButton size="small" onClick={(e) => downloadPoam(e, val)}>
                  <Icon>file_download</Icon>
                </IconButton>
              </PoamListItem>
            ))
          )}
        </List>

        <ButtonGroup variant="contained" style={{ width: "100%" }}>
          <Button onClick={openUploadDialog} style={{ flexGrow: 1 }}>
            Add File
          </Button>

          <Button onClick={openCreateDialog} style={{ flexGrow: 1 }}>
            Create New
          </Button>
        </ButtonGroup>
      </Box>

      <Backdrop className={classes.backdrop} open={isLoading("download")}>
        <CircularProgress color="inherit" />
        <Typography className="backdrop-label" variant="h5">
          Fetching data...
        </Typography>
      </Backdrop>

      {downloadPoamProps && (
        <DownloadPoam
          open={Boolean(downloadPoamProps)}
          {...downloadPoamProps}
        />
      )}

      {isDialogOpen() && (
        <AddNewPoamDialog
          isOpen={isDialogOpen()}
          close={closeDialog}
          isCreate={isCreateDialog}
          loading={{
            isLoading: () => isLoading("upload"),
            startLoading: () => startLoading("upload"),
            stopLoading: () => stopLoading("upload"),
          }}
          selectFile={selectFile}
          cspName={cspName}
        />
      )}
    </Box>
  );
}
