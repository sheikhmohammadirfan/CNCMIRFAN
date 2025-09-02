import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Icon,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import unknownLogo from "../../assets/img/unknown.svg";
import otherLogo from "../../assets/img/other.svg";
import CloseButton from "../Utils/CloseButton";
import DialogBox from "./DialogBox";
import { notification } from "./Utils";
// Function to return, File type as integer
function getExt(name) {
  return /(?:\.([^.]+))?$/.exec(name)[0]?.toLowerCase();
}

// CSS class generator
const useStyles = makeStyles((theme) => ({
  titleContainer: {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
  },
}));

// Row file that is uploaded
const FileRow = ({ name, update, setter, icon }) => {
  return (
    <Box display="flex" alignItems="center">
      <img src={icon ? icon : unknownLogo} alt="File" />
      <Box paddingX={1} width={1}>
        <TextField value={name} onChange={update} fullWidth />
      </Box>
      <CloseButton type="text" size="small" click={setter} />
    </Box>
  );
};

// Main Compoent
function Upload({
  id,
  uploadService,
  updateFileLst,
  validFiles = {},
  maxFile = 1000,
}) {
  // Get styles
  const classes = useStyles();

  // Get list of extension list
  const extLst = Object.keys(validFiles);

  // React hook, to save selected files
  const [files, setFiles] = useState([]);

  // React state to set valid files status to activate/deactivate upload btn
  const [isAllValid, setValidFiles] = useState(true);
  useEffect(() => {
    if (extLst.length > 0) {
      let i = 0;
      while (i < files.length && extLst.includes(getExt(files[i].name))) i++;
      setValidFiles(i === files.length);
    }
  }, [files, extLst]);

  // React state to set loading status btn
  const [uploadStarted, setUploadStatus] = useState(false);
  const toggleUploading = () => setUploadStatus((val) => !val);

  // Upload files method
  const updateFiles = (e) => {
    // Get uploaded file obj
    const fileList = e.target.files;
    if (Object.keys(fileList).length + files.length > maxFile)
      notification("upload-toast", "Upload Limit exceeded.", "error");
    // Add new files
    else
      setFiles((file) => [
        ...file,
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

  // Cloe upload dialog
  const closeUpload = () => {
    document.getElementById(id).value = "";
    setFiles([]);
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

      <DialogBox
        open={files.length > 0}
        onClose={() => !uploadStarted && closeUpload()}
        aria-labelledby="upload-dialog"
        loading={uploadStarted}
        bottomSeperator={true}
        title={
          <>
            <Typography display="inline" variant="h6">
              Upload files
            </Typography>
            <CloseButton
              click={() => !uploadStarted && closeUpload()}
              size="small"
              color="secondary"
              variant="contained"
              disabled={uploadStarted}
            />
          </>
        }
        titleProp={{
          className: classes.titleContainer,
          disableTypography: true,
        }}
        content={files.map((file, index) => (
          <FileRow
            key={index}
            name={file.name}
            update={(e) => updateName(index, e.target.value)}
            setter={() => removeFiles(index)}
            icon={extLst.length ? validFiles[getExt(file.name)] : otherLogo}
          />
        ))}
        actions={[
          <Button
            htmlFor={id}
            component="label"
            color="primary"
            variant="contained"
            size="small"
            startIcon={<Icon>add</Icon>}
            disabled={uploadStarted || files.length === maxFile}
          >
            Add More
          </Button>,
          <Button
            color="secondary"
            variant="contained"
            size="small"
            startIcon={<Icon>upload</Icon>}
            disabled={uploadStarted || !isAllValid}
            onClick={pushFiles}
          >
            Upload
          </Button>,
        ]}
      />
    </>
  );
}

export default Upload;
