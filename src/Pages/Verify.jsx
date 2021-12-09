import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Icon,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import DocumentTitle from "../Components/DocumentTitle";
import Upload from "../Components/Utils/Upload";
import DataTable from "../Components/Utils/DataTable";
import DialogBox from "../Components/Utils/DialogBox";
import {
  deleteFiles,
  getFiles,
  uploadFiles,
  verifyFile,
} from "../Service/Verify.service";
import pdfLogo from "../assets/img/pdf.svg";
import docLogo from "../assets/img/doc.svg";
import txtLogo from "../assets/img/txt.svg";

// Object of valid files
const validFiles = {
  ".pdf": pdfLogo,
  ".doc": docLogo,
  ".docx": docLogo,
  ".txt": txtLogo,
};

// Content for header of table
const header = {
  data: [
    { text: "ID" },
    { text: "FileName" },
    { text: "Last Activity", props: { align: "right" } },
  ],
};

// row data
const row = (lst) =>
  lst.map((file, index) => ({
    data: [
      { text: index + 1 },
      { text: file.file_name },
      { text: file.file.split("/")[5], props: { align: "right" } },
    ],
  }));

/** Verify page compoent */
export default function Verify(props) {
  DocumentTitle(props.title);

  // React state, to show/hide warning dialog
  const [dialog, setDialog] = useState(false);
  const showDailog = () => setDialog(true);
  const hideDailog = () => setDialog(false);

  // React state, to save list of files
  const [fileList, setFileList] = useState([]);

  // Fetch files from server
  const fetchFiles = async () => {
    const { data, status } = await getFiles();
    status && setFileList(data);
    setLoading(false);
  };

  // Fetch all files when component is mounted
  useEffect(() => fetchFiles(), []);

  // React state, to indicate loading status
  const [loading, setLoading] = useState(true);

  // React state, to save selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Method to delete list of selected files
  const deleteSelectedFiles = async () => {
    // Delete files
    const status = await deleteFiles(
      selectedRows.map((row) => fileList[row[0].text - 1])
    );
    hideDailog();
    setLoading(true);
    if (status) {
      // If success then update files
      setSelectedRows([]);
      await fetchFiles();
    }
  };

  // Method ot selected verify file
  const verifySelectedFile = async () => {
    if (selectedRows.length > 0) {
      setLoading(true);
      const { data, status } = await verifyFile(
        fileList[selectedRows[0][0].text - 1].id
      );
      setLoading(false);
      console.log(data, status);
    }
  };

  // Compoent to show warning dialog
  const WarningDailog = () => {
    const [deleteLoader, setDeleteLoader] = useState(false);
    return (
      <DialogBox
        open={dialog}
        close={() => !deleteLoader && hideDailog()}
        title="Delete Files"
        loading={deleteLoader}
        content={`Are you sure to delete ${selectedRows.length} selected files ?`}
        actions={[
          <Button
            onClick={() => deleteSelectedFiles() && setDeleteLoader(true)}
            disabled={deleteLoader}
          >
            Yes
          </Button>,
          <Button onClick={hideDailog} disabled={deleteLoader}>
            No
          </Button>,
        ]}
      />
    );
  };

  // Component for footer of table
  const FooterComponent = () => (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => selectedRows.length > 0 && showDailog()}>
        <Icon>delete</Icon>
      </IconButton>
      <Button color="primary" variant="contained" onClick={verifySelectedFile}>
        Verify
      </Button>
      <Fade in={loading} mountOnEnter unmountOnExit>
        <Box paddingX={1}>
          <CircularProgress size={32} />
        </Box>
      </Fade>
    </Box>
  );

  return (
    <Box padding={1} textAlign="center">
      <WarningDailog />

      <Upload
        id="uploadFiles"
        uploadService={uploadFiles}
        updateFileLst={fetchFiles}
        validFiles={validFiles}
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
          header={header}
          rows={row(fileList)}
          footerComponent={<FooterComponent />}
        />
      </Box>
    </Box>
  );
}
