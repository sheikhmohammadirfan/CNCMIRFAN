import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Icon,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import DocumentTitle from "../Components/DocumentTitle";
import Upload from "../Components/Utils/Upload";
import DataTable from "../Components/Utils/DataTable";
import { deleteFiles, getFiles, uploadFiles } from "../Service/upload.service";
import pdfLogo from "../assets/img/pdf-file-format.png";
import docLogo from "../assets/img/doc-file-format.png";
import txtLogo from "../assets/img/txt-file-format.png";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
}));

const WarningToast = ({ deleteMethod }) => {
  return (
    <Box>
      Are you sure to delete selected files?
      <Box marginTop={0.5}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            deleteMethod();
            toast.dismiss("delete-toast");
          }}
        >
          Yes
        </Button>
        <Button
          size="small"
          variant="contained"
          style={{ marginLeft: 8 }}
          onClick={() => toast.dismiss("delete-toast")}
        >
          No
        </Button>
      </Box>
    </Box>
  );
};

export default function Verify(props) {
  DocumentTitle(props.title);
  const classes = useStyles();

  const [fileList, setFileList] = useState([]);
  const updateFiles = async () => {
    const { data, status } = await getFiles();
    status && setFileList(data);
  };

  const validFiles = {
    ".pdf": pdfLogo,
    ".doc": docLogo,
    ".docx": docLogo,
    ".txt": txtLogo,
  };

  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect((files) => {
    updateFiles().then((val) => setLoading(false));
  }, []);

  const deleteSelectedFiles = async () => {
    if (selectedRows.length > 0) {
      setLoading(true);
      const status = await deleteFiles(
        selectedRows.map((row) => fileList[row[0].text - 1])
      );
      if (status) {
        setSelectedRows([]);
        await updateFiles();
        setLoading(false);
      }
    }
  };

  const showWarning = () => {
    toast(<WarningToast deleteMethod={deleteSelectedFiles} />, {
      toastId: "delete-toast",
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      type: "error",
    });
  };

  return (
    <div className={classes.container}>
      <Upload
        id="uploadFiles"
        uploadService={uploadFiles}
        updateFileLst={updateFiles}
        validFilesLst={validFiles}
        maxFile={10}
      />
      <Button
        component="label"
        htmlFor="uploadFiles"
        variant="outlined"
        color="primary"
        endIcon={<Icon>cloud_upload</Icon>}
      >
        Choose file
      </Button>
      <Box width="90%" maxWidth={600} marginX="auto">
        <DataTable
          checkbox={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          pagging={10}
          showIndex={true}
          header={{
            row: {},
            cols: {},
            data: [
              { text: "ID" },
              { text: "FileName" },
              { text: "Last Activity", props: { align: "right" } },
            ],
          }}
          rows={fileList.map((file, index) => [
            { text: index + 1 },
            { text: file.file_name },
            { text: file.file.split("/")[5], props: { align: "right" } },
          ])}
          footerComponent={
            <Box display="flex" alignItems="center">
              <IconButton onClick={showWarning}>
                <Icon>delete</Icon>
              </IconButton>
              <Button color="primary" variant="contained">
                Verify
              </Button>
              <Fade in={loading} mountOnEnter unmountOnExit>
                <Box paddingX={1}>
                  <CircularProgress size={32} />
                </Box>
              </Fade>
            </Box>
          }
        />
      </Box>
    </div>
  );
}
