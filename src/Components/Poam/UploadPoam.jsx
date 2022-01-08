import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  makeStyles,
  Typography,
  Zoom,
} from "@material-ui/core";
import React, { useState } from "react";
import { FileDrop } from "react-file-drop";
import { uploadFile } from "../../Service/Poam.service";

const useStyle = makeStyles((theme) => ({
  // Style for drag-n-drop contained
  dragContainer: {
    "& .file-drop-target": {
      width: "100%",
      color: "#0000004d",
      borderRadius: 2 * theme.shape.borderRadius,
      padding: theme.spacing(2.5),
      transition: "all 0.2s linear",
    },
    "& label": {
      color: "#0000ff6e",
      cursor: "pointer",
      "&:hover": { color: "blue" },
    },
    "& .MuiTypography-root": {
      padding: theme.spacing(1 / 2),
      fontWeight: "bold",
    },
    "& .wrapper": {
      height: "50vh",
      border: `${theme.spacing(1 / 2)}px dashed #0000004d`,
      borderRadius: theme.shape.borderRadius,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .file-container": {
      width: "100%",
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    "&.active": {
      "& .file-drop-target": {
        color: "black",
        background: theme.palette.grey[200],
        border: `1px solid ${theme.palette.grey[400]}`,
      },
      "& .wrapper": {
        borderColor: "black",
      },
      "& label": {
        color: "blue",
      },
    },
  },
}));

function UploadPoam({ fetchData }) {
  const classes = useStyle();

  // Hook to save loading state
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  // State to save whether file is dragged or not
  const [activeDrag, setActiveDrag] = useState(false);

  // State to store picked file to upload
  const [pickedFile, setPickedFile] = useState();

  // Upload file, and redirect on success
  const uploadFiles = async () => {
    if (pickedFile && !isLoading) {
      startLoading();
      const { status } = await uploadFile(pickedFile);
      if (status) fetchData();
      stopLoading();
    }
  };

  return (
    <Box padding={1} overflow="hidden">
      <FileDrop
        className={`${classes.dragContainer} ${activeDrag ? "active" : ""}`}
        onFrameDragEnter={(e) => setActiveDrag(true)}
        onFrameDragLeave={(e) => setActiveDrag(false)}
        onFrameDrop={(e) => setActiveDrag(false)}
        onDrop={(files, e) => setPickedFile(files[0])}
      >
        <Box className="wrapper">
          <Icon fontSize="large">upload_file</Icon>
          <Box display="flex">
            <input
              multiple
              id="poam-file-upload"
              type="file"
              onChange={(e) => setPickedFile(e.target.files[0])}
              hidden
            />
            <Typography variant="h6" noWrap>
              <label htmlFor="poam-file-upload">Choose file</label> or Drop here
            </Typography>
          </Box>
          {pickedFile && (
            <Zoom in={pickedFile}>
              <Box className="file-container">
                <Chip
                  label={pickedFile?.name || ""}
                  variant="outlined"
                  color="secondary"
                  style={{ maxWidth: "100%", marginBottom: "8px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={uploadFiles}
                  startIcon={
                    isLoading ? (
                      <CircularProgress color="inherit" size={22} />
                    ) : (
                      <Icon>file_upload</Icon>
                    )
                  }
                >
                  Upload
                </Button>
              </Box>
            </Zoom>
          )}
        </Box>
      </FileDrop>
    </Box>
  );
}

export default UploadPoam;
