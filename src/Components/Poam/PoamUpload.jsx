import {
  Typography,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  makeStyles,
  IconButton,
  Icon,
  Tooltip,
  Backdrop,
  CircularProgress,
  FormHelperText,
  InputAdornment,
} from "@material-ui/core";
import React, { useLayoutEffect } from "react";
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
import { Menu, MenuItem, Stack } from "@mui/material";
import Chart from "../Chart";
import { userData } from "../../assets/data/dummyData";
import Drive from "../Drive";


function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth]);

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

// Generate styles
const useStyle = makeStyles((theme) => ({
  // style for list title
  titleStyle: {
    fontWeight: "bold",
  },

  // style for list container
  listContainer: { padding: `0 ${theme.spacing(1 / 2)}px`, overflow: "hidden" },

  // Style for list item
  listItem: {
    margin: "12px 0",
    borderRadius: 4,
    border: "1px solid rgba(0, 0, 0, 0.2)",
    transition: "all 0.1s linear",
    display: "flex",
    justifyContent: "space-between",
    "& .MuiIconButton-root": { padding: "0 3px", width: 24 },
    "&:hover": {
      borderColor: "black",
      background: "transparent",
      boxShadow: theme.shadows[1],
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

/* DIALOG TO ADD/CREATE NEW POA&M */
const AddNewPoamDialog = ({
  isOpen,
  close,
  isCreate,
  loading: { isLoading, startLoading, stopLoading },
  selectFile,
  cspName,
  cspLoading,
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
          if (val.length < 4 || val.length > 20)
            return "File name should have min 4 and max 20 characters.";
          return true;
        },
      },
    },
    csp: {
      validate: {
        valid: (val) => {
          if (!val) return "This field is required.";
          if (val.length < 4 || val.length > 20)
            return "CSP should have min 4 and max 20 characters.";
          return true;
        },
      },
    },
    system_name: {
      validate: {
        valid: (val) => {
          if (!val) return "This field is required.";
          if (val.length < 4 || val.length > 20)
            return "System name should have min 4 and max 20 characters.";
          return true;
        },
      },
    },
    agency_name: {
      validate: {
        valid: (val) => {
          if (!val) return "This field is required.";
          if (val.length < 4 || val.length > 20)
            return "Agency name should have min 4 and max 20 characters.";
          return true;
        },
      },
    },
  };

  // Get form object
  const { handleSubmit, control, watch, setValue, formState } = useForm({
    defaultValues,
  });
  const watchFile = watch("file");

  // set csp input field's value to what we received from backend
  if (cspName) {
    setValue("csp", cspName);
  }

  // Make create api call with onsubmitting form
  const onSubmit = async (formData) => {
    startLoading();
    const { data, status } = await (isCreate()
      ? createNewPoam(formData)
      : uploadPoam(formData));
    if (!status) return stopLoading();
    close();
    const fileName = isCreate() ? formData.file_name : formData.file.name;
    selectFile(data.file_id, fileName);
    stopLoading();
  };

  return (
    <DialogBox
      open={isOpen}
      onClose={close}
      title={isCreate() ? "Create New POA&M" : "Add New POA&M"}
      maxWidth={isCreate() ? "xs" : "sm"}
      fullWidth
      bottomSeperator={true}
      loading={isLoading()}
      content={
        <Box marginY={2} maxWidth="100%">
          <Form
            control={control}
            rules={validation}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={1}>
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
                  disabled={cspLoading || Boolean(cspName)}
                  gutter={false}
                  InputProps={
                    cspLoading && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                      ),
                    }
                  }
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

              {!isCreate() && (
                <Grid item xs={12}>
                  <UploadControl name="file" multiple={false}>
                    {(trigger) => (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={
                            <Icon>{watchFile ? "delete" : "attach_file"}</Icon>
                          }
                          onClick={() =>
                            watchFile ? setValue("file", null) : trigger()
                          }
                        >
                          <span style={{ textTransform: "none" }}>
                            {watchFile ? watchFile.name : "SELECT FILE"}
                          </span>
                        </Button>
                        {formState.errors.file && (
                          <FormHelperText
                            error={Boolean(formState.errors.file)}
                          >
                            Please select a POA&M File
                          </FormHelperText>
                        )}
                      </>
                      // formState
                    )}
                  </UploadControl>
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
          disabled={cspLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {isCreate() ? "Create" : "Add"}
        </Button>,
      ]}
    />
  );
};

/* COMPONENT FORM ITEM OF POA&M LIST */
const PoamListItem = ({
  text,
  onDownload,
  loading = false,
  iconTooltip = "",
  ...rest
}) => (
  <ListItem button disableRipple className={useStyle().listItem} {...rest}>
    <Typography noWrap>{text}</Typography>

    {onDownload && (
      <Tooltip arrow title="Download file">
        <IconButton size="small" onClick={onDownload}>
          <Icon>file_download</Icon>
        </IconButton>
      </Tooltip>
    )}

    {loading && <CircularProgress size={20} color="inherit" />}
  </ListItem>
);

/* ROOT UPLOAD COMPONENT */
export default function PoamUpload({ selectFile }) {
  // Get css styles
  const classes = useStyle();

  // Get width for responsive dashboard
  const [width] = useWindowSize();


  // Manage add new POA&M dialog status
  const [dialogOpen, setDialogOpen] = useState(-1);
  const isDialogOpen = () => dialogOpen !== -1;
  const isCreateDialog = () => dialogOpen === 1;
  const isUploadDialog = () => dialogOpen === 0;
  const openCreateDialog = () => setDialogOpen(1);
  const openUploadDialog = () => setDialogOpen(0);
  const closeDialog = () => setDialogOpen(-1);

  // State to save api data
  const [cspName, setCspName] = useState("");
  const [cspLoading, setCspLoading] = useState(false);
  const [poamList, setPoamList] = useState([]);

  // State to save download props
  const [downloadPoamProps, setDownloadPoamProps] = useState();

  // Loader state
  const { isLoading, startLoading, stopLoading } = useLoading({
    download: false,
    upload: false,
    load: false,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpload = () => {
    handleClose();
    openUploadDialog();
  };

  const handleCreate = () => {
    handleClose();
    openCreateDialog();
  };
  // fetch POA&M list on component mount
  useEffect(() => {
    (async () => {
      startLoading("load");
      const { data, status } = await getPoamList();
      if (!status) return stopLoading("load");
      if (data) setPoamList(data);
      stopLoading("load");
    })();

    (async () => {
      setCspLoading(true);
      const res = await getCSP();
      if (!res.status) return;
      if (res.data.csp) setCspName(res.data.csp);
      setCspLoading(false);
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

  const handlePoamTemlateClick = () => {
    const link = document.createElement("a");
    link.href = "/assets/POA&M_TEMPLATE.xlsx";
    link.download = "POA&M_Template.xlsx"; // custom file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box height="80vh" width="100%" paddingX={2} paddingY={3}>  
    <Box marginBottom={3}>
      <Chart
        data={width > 800 ? userData : userData.slice(0, 4)}
        title="Analytics"
        grid
        dataKey="Active User"
      />
      <Drive />
    </Box>
      <Box width="100%">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="end"
          borderBottom={1}
          paddingY={1}
        >
          <Typography noWrap variant="h6" className={classes.titleStyle}>
            List of POA&M Files
          </Typography>
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePoamTemlateClick}
              color="primary"
              startIcon={<Icon>download</Icon>}
            >
              POA&M Template
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleClick}
              color="primary"
            >
              Add POA&M
            </Button>
          </Stack>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpload}>Upload POA&M</MenuItem>
            <MenuItem onClick={handleCreate}>Create POA&M Manually</MenuItem>
          </Menu>
        </Box>

        <List disablePadding className={classes.listContainer}>
          {isLoading("load") ? (
            <PoamListItem text="Loading..." loading={true} disabled />
          ) : poamList.length === 0 ? (
            <PoamListItem text="NO POA&M FILE" disabled />
          ) : (
            poamList.map((poamFileDetails, index) => (
              <PoamListItem
                key={index}
                text={poamFileDetails.file_name}
                onClick={() =>
                  selectFile(poamFileDetails.id, poamFileDetails.file_name)
                }
                onDownload={(e) => downloadPoam(e, poamFileDetails.id)}
              />
            ))
          )}
        </List>
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
          cspLoading={cspLoading}
        />
      )}
    </Box>
  );
}
