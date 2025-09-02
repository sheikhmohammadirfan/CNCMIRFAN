import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Icon,
  IconButton,
} from "@material-ui/core";
import DocumentTitle from "../Components/DocumentTitle";
import Upload from "../Components/Utils/Upload";
import DataTable from "../Components/Utils/DataTable/DataTable";
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

// Compoent to show warning dialog
const WarningDailog = ({ openState, closeDialog, rows, deleteFiles }) => {
  const [isLoading, setLoader] = useState(false);
  const startLoading = () => setLoader(true);
  const stopLoading = () => setLoader(false);
  const close = () => {
    stopLoading();
    closeDialog();
  };

  return (
    <DialogBox
      open={openState}
      close={() => !isLoading && close()}
      title="Delete Files"
      loading={isLoading}
      content={`Are you sure to delete ${rows.length} selected files ?`}
      actions={[
        <Button
          onClick={() => {
            startLoading();
            deleteFiles(stopLoading);
          }}
          disabled={isLoading}
        >
          Yes
        </Button>,
        <Button onClick={close} disabled={isLoading}>
          No
        </Button>,
      ]}
    />
  );
};

// Component for footer of table
const FooterComponent = ({ isLoading, showDailog, verifyMethod }) => (
  <Box display="flex" alignItems="center">
    <IconButton onClick={showDailog}>
      <Icon>delete</Icon>
    </IconButton>
    <Button color="primary" variant="contained" onClick={verifyMethod}>
      Verify
    </Button>
    <Fade in={isLoading} mountOnEnter unmountOnExit>
      <Box paddingX={1}>
        <CircularProgress size={32} />
      </Box>
    </Fade>
  </Box>
);

/** Verify page compoent */
export default function Verify(props) {
  DocumentTitle(props.title);

  // React state, to show/hide warning dialog
  const [dialog, setDialog] = useState(false);
  const showDailog = () => setDialog(true);
  const hideDailog = () => setDialog(false);

  // React state, to save list of files
  const [fileList, setFileList] = useState([]);

  // React state, to indicate loading status
  const [loading, setLoading] = useState(true);

  // React state, to save selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch files from server
  const fetchFiles = async () => {
    setLoading(true);
    const { data, status } = await getFiles();
    status && setFileList(data);
    setLoading(false);
  };

  // Fetch all files when component is mounted
  useEffect(() => fetchFiles(), []);

  // Method to delete list of selected files
  const deleteSelectedFiles = async (stopLoading) => {
    // Delete files
    const status = await deleteFiles(
      selectedRows.map((index) => fileList[index])
    );
    stopLoading();
    hideDailog();
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
      await verifyFile(fileList[selectedRows[0]].id);
      setLoading(false);
    }
  };

  // Content for header of table
  const header = {
    data: [
      { text: "ID" },
      { text: "FileName" },
      { text: "Last Activity", params: { align: "right" } },
    ],
  };

  // row data
  const rows = () => ({
    rowData: fileList.map((file, index) => ({
      data: [
        { text: index + 1 },
        { text: file.file_name },
        { text: "", params: { align: "right" } },
      ],
    })),
  });

  return (
    <Box padding={1} textAlign="center">
      <WarningDailog
        openState={dialog}
        closeDialog={hideDailog}
        rows={selectedRows}
        deleteFiles={deleteSelectedFiles}
      />

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

      <Box width="90%" maxWidth={600} marginY={1} marginX="auto">
        <DataTable
          checkbox={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          pageSize={10}
          serialNo={false}
          header={header}
          rowList={rows()}
          footerComponent={
            <FooterComponent
              isLoading={loading}
              showDailog={() => selectedRows.length > 0 && showDailog()}
              verifyMethod={verifySelectedFile}
            />
          }
        />
      </Box>
    </Box>
  );
}
