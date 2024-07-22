import {
  Box,
  Button,
  Typography,
  Tooltip,
  withStyles,
  TextField,
  Icon
} from "@material-ui/core";
import ReferencesTable from "./ReferencesTable";
import { useState } from "react";
import DialogBox from "../../Utils/DialogBox";
import { useStyle } from "../Utils";

const References = ({ references, isLoading, setReferences }) => {
  const classes = useStyle();
  const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 20,
      maxWidth: 300,
    },
  }))(Tooltip);

  const [currentRow, setCurrentRow] = useState({});
  const [dialog, setDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showUploadFile, setShowUploadFile] = useState(false);

  const column_names = [
    "DOCUMENT NAME",
    "UPLOAD DATE",
    "UPLOADED BY",
    "DESCRIPTION",
  ];

  const references_columns = [
    "DOCUMENT_NAME",
    "UPLOAD_DATE",
    "UPLOADED_BY",
    "DESCRIPTION",
  ];

  const rows = [references];

  const handleRowClick = (rowIndex) => {
    console.log("rowindex", rowIndex)
    setCurrentRow(rows[0][rowIndex]);
    setDialog(true);
    console.log(currentRow);
  };

  const handleDialogClick = (button) => {
    setDialog(false);
    if (button === "Download") {
      handleDownload();
    } else if (button === "Edit") {
      setNewName(currentRow.DOCUMENT_NAME);
      setNewDesc(currentRow.DESCRIPTION);
      setEditDialog(true);
    } else if (button === "Delete") {
      handleDelete();
    }
  };

  const handleEdit = () => {
    const updatedReferences = references.map((reference) =>
      reference === currentRow
        ? { ...reference, DOCUMENT_NAME: newName, DESCRIPTION: newDesc }
        : reference
    );
    setReferences(updatedReferences);
    setEditDialog(false);
  };

  const handleDelete = () => {
    references = references.filter((reference) => reference !== currentRow);
    setReferences(references);
  };

  const handleDownload = () => {
    //Download the current row's document
  };

  const handleImportClick = () => {
    setShowUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setShowUploadFile(false);
  };

  const handleImport = (rows) => {
    // upload the document
  };

  return (
    <Box className={classes.table}>
      <Box ml={4} mt={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="95%"
          height="40px"
          alignItems="center"
        >
          <Box ml={1} mb={2}>
            <Typography variant="h6">References</Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleImportClick}
            startIcon={<Icon>uploadFile</Icon>}
            color="primary"
            className={classes.button}
          >
            Upload file
          </Button>
        </Box>
      </Box>
      <Box>
        <ReferencesTable
          isLoading={isLoading}
          allColumns={column_names}
          columns={references_columns}
          rows={rows}
          handleRowClick={handleRowClick}
        />
      </Box>

      {/* Dialog for when a row is clicked*/}
      <DialogBox
        open={dialog}
        close={() => setDialog(false)}
        title={
          <Typography style={{ fontWeight: "bold" }}>Row Actions</Typography>
        }
        actions={[
          <CustomTooltip placement="bottom" title={"Download reference"}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleDialogClick("Download")}
            >
              Download
            </Button>
          </CustomTooltip>,
          <CustomTooltip placement="bottom" title={"Edit reference details"}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleDialogClick("Edit")}
            >
              Edit Details
            </Button>
          </CustomTooltip>,
          <CustomTooltip title={"Delete reference"} placement="bottom">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleDialogClick("Delete")}
            >
              Delete
            </Button>
          </CustomTooltip>,
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => handleDialogClick("Cancel")}
          >
            Cancel
          </Button>,
        ]}
      ></DialogBox>

      {/* Dialog for when a row is being edited*/}
      <DialogBox
        open={editDialog}
        close={() => setEditDialog(false)}
        title={
          <Typography style={{ fontWeight: "bold" }}>
            {currentRow?.DOCUMENT_NAME}
          </Typography>
        }
        bottomSeperator={true}
        content={
          <Box display="flex" flexDirection="column" mt={2}>
            <TextField
              variant="outlined"
              label="File Name"
              placeholder={currentRow?.DOCUMENT_NAME}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              multiline
              rows={1}
              style={{ width: "400px", height: "100px" }}
            />
            <TextField
              variant="outlined"
              label="Description (optional)"
              placeholder={currentRow?.DESCRIPTION}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              multiline
              rows={4}
              style={{ width: "400px", height: "130px" }}
            />
          </Box>
        }
        actions={[
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleEdit()}
          >
            Update
          </Button>,
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => setEditDialog(false)}
          >
            Cancel
          </Button>,
        ]}
      />
    </Box>
  );
};

export default References;
