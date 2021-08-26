import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Icon,
  IconButton,
  makeStyles,
  Fade,
  TextField,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { toast } from "react-toastify";
import unknownLogo from "../../assets/img/unknown-file-format.png";
import otherLogo from "../../assets/img/other-file-format.png";

// Function to handle Notification toast
function notification(msg, type) {
  toast(msg, { type, toastId: "upload-toast", position: "top-center" });
}

// Function to return, File type as integer
function getExt(name) {
  return /(?:\.([^.]+))?$/.exec(name)[0]?.toLowerCase();
}

// Generate styles
const useStyles = makeStyles((theme) => ({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    paddingTop: theme.spacing(10),
  },
  container: {
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    border: `1px solid ${theme.palette.grey[300]}`,
    width: "90%",
    maxWidth: 400,
  },
  container_title: {
    fontWeight: "bold",
  },
}));

// Close Warning dialog
const WarningDialog = ({ cnt, set }) => {
  return (
    <Box>
      Are you sure ? <strong>{cnt} files are yet to upload.</strong>
      <Box marginTop={0.5}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            toast.dismiss("upload-toast");
            set([]);
          }}
        >
          Yes
        </Button>
        <Button
          size="small"
          variant="contained"
          style={{ marginLeft: 8 }}
          onClick={() => toast.dismiss("upload-toast")}
        >
          No
        </Button>
      </Box>
    </Box>
  );
};

// Row file that is uploaded
const FileRow = ({ name, update, setter, icon }) => {
  return (
    <Box display="flex" alignItems="center">
      <img src={icon ? icon : unknownLogo} alt="File" />
      <Box paddingX={1} width={1}>
        <TextField value={name} onChange={update} fullWidth />
      </Box>
      <IconButton size="small" onClick={setter}>
        <Icon>close</Icon>
      </IconButton>
    </Box>
  );
};

// Main Compoent
function Upload({
  id,
  uploadService,
  updateFileLst,
  validFilesLst = {},
  maxFile = 1000,
}) {
  const classes = useStyles();

  const extLst = Object.keys(validFilesLst);

  const [files, setFiles] = useState([]);

  // React state to set loading status btn
  const [uploadStarted, setUploadStatus] = useState(false);
  const toggleUploading = () => setUploadStatus((val) => !val);

  // React state to set valid files status to activate/deactivate upload btn
  const [validFiles, setValidFiles] = useState(true);
  useEffect(() => {
    if (extLst.length > 0) {
      let i = 0;
      while (i < files.length && extLst.includes(getExt(files[i].name))) i++;
      setValidFiles(i === files.length);
    }
  }, [files]);

  // Upload files method
  const updateFiles = (e) => {
    // Get uploaded file obj
    const fileList = e.target.files;
    if (Object.keys(fileList).length + files.length > maxFile)
      notification("Upload Limit exceeded.", "error");
    // Add new files
    else
      setFiles([
        ...files,
        ...Object.keys(fileList).map((index) => fileList[index]),
      ]);
    e.target.value = "";
  };

  // Upddate name
  const updateName = (index, val) => {
    const fileList = [...files];
    const file = fileList[index];
    // Replace file object with new name
    fileList[index] = new File([file], val, {
      type: file.type,
      lastModified: file.lastModified,
    });
    setFiles(fileList);
  };

  // Remove selected files
  const removeFiles = (delIndex) => {
    const fileList = [...files];
    setFiles(fileList.filter((_, index) => index !== delIndex));
  };

  // Show warning toast
  const showWarning = () => {
    toast(<WarningDialog cnt={files.length} set={setFiles} />, {
      type: "error",
      toastId: "upload-toast",
      autoClose: false,
      closeOnClick: false,
      position: "top-center",
    });
  };

  // Upload files
  const pushFiles = async () => {
    toggleUploading();
    const { status } = await uploadService(files);
    toggleUploading();
    if (status) {
      updateFileLst?.(files);
      setFiles([]);
    }
  };

  return (
    <>
      <input
        multiple
        id={id}
        type="file"
        accept={extLst.join(", ")}
        onChange={updateFiles}
        hidden
      />
      <Fade in={files.length > 0} mountOnEnter unmountOnExit>
        <Box
          className={classes.overlay}
          display="flex"
          justifyContent="center"
          alignItems="start"
        >
          <Box className={classes.container}>
            <Box display="flex" justifyContent="space-between" padding={1}>
              <Typography variant="h6" className={classes.container_title}>
                Upload
              </Typography>
              <IconButton
                size="small"
                color="secondary"
                variant="contained"
                onClick={showWarning}
              >
                <Icon>cancel</Icon>
              </IconButton>
            </Box>

            {uploadStarted ? (
              <LinearProgress />
            ) : (
              <hr style={{ border: "2px solid #444", margin: 0 }} />
            )}

            <Box padding={1} overflow="auto" maxHeight={300}>
              {files.map((file, index) => (
                <FileRow
                  key={index}
                  name={file.name}
                  update={(e) => updateName(index, e.target.value)}
                  setter={() => removeFiles(index)}
                  icon={
                    extLst.length > 0
                      ? validFilesLst[getExt(file.name)]
                      : otherLogo
                  }
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Button
                htmlFor={id}
                component="label"
                color="primary"
                variant="contained"
                size="small"
                startIcon={<Icon>add</Icon>}
                style={{ margin: 4 }}
                disabled={uploadStarted || files.length === maxFile}
              >
                Add More
              </Button>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                startIcon={<Icon>upload</Icon>}
                style={{ margin: 4 }}
                disabled={uploadStarted || !validFiles}
                onClick={pushFiles}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </>
  );
}

export default Upload;
