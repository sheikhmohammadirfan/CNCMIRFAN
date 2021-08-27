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
import DataTable from "../Components/Utils/DataTable";
import { deleteFiles, getFiles, uploadFiles } from "../Service/Verify.service";
import pdfLogo from "../assets/img/pdf-file-format.png";
import docLogo from "../assets/img/doc-file-format.png";
import txtLogo from "../assets/img/txt-file-format.png";
import { toast } from "react-toastify";

/**
 * Warning Toast message
 */
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

// Method to show warning before deleting files
function showWarning(mtd) {
  toast(<WarningToast deleteMethod={mtd} />, {
    toastId: "delete-toast",
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    type: "error",
  });
}

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
  lst.map((file, index) => [
    { text: index + 1 },
    { text: file.file_name },
    { text: file.file.split("/")[5], props: { align: "right" } },
  ]);

/** Verify page compoent */
export default function Verify(props) {
  DocumentTitle(props.title);

  // React state, to save list of ifles
  const [fileList, setFileList] = useState([]);

  // Fetch files from server
  const fetchFiles = async () => {
    const { data, status } = await getFiles();
    status && setFileList(data);
  };

  // Fetch all files when component is mounted
  useEffect((files) => fetchFiles().then((val) => setLoading(false)), []);

  // React state, to indicate loading status
  const [loading, setLoading] = useState(true);

  // React state, to save selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Method to delete list of selected files
  const deleteSelectedFiles = async () => {
    setLoading(true);
    // Delete files
    const status = await deleteFiles(
      selectedRows.map((row) => fileList[row[0].text - 1])
    );
    if (status) {
      // If success then update files
      setSelectedRows([]);
      await fetchFiles();
      setLoading(false);
    }
  };

  // Component for footer of table
  const FooterComponent = () => (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() =>
          selectedRows.length > 0 && showWarning(deleteSelectedFiles)
        }
      >
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
  );

  return (
    <Box padding={1} textAlign="center">
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
