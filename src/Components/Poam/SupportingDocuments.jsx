import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  Typography,
  makeStyles,
  Icon,
  Tooltip,
} from "@material-ui/core";
import React, { useState } from "react";
import { RadioControl, TextControl } from "../Control";
import CloseButton from "../Utils/CloseButton";
import DialogBox from "../Utils/DialogBox";

const useStyle = makeStyles((theme) => ({
  documentList: {
    width: "100%",
    "& > li": {
      paddingLeft: 0,
      paddingRight: 0,
    },
    "& > li:last-child": {
      justifyContent: "flex-end",
    },
    "& .MuiChip-root": {
      margin: theme.spacing(1 / 2),
      maxWidth: `calc(100% - ${theme.spacing(1 / 2)}px)`,
    },
  },
  titleContainer: {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
  },
  uploadButton: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    minWidth: "auto",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
}));

const DocumentChip = ({ type, doc, onDelete }) => {
  return (
    <Chip
      variant="outlined"
      size="small"
      label={<b>{`${type}: ${doc}`}</b>}
      color="primary"
      onDelete={onDelete}
    />
  );
};

const DocumentSelect = ({ open, onClose, onSelect, options }) => {
  const classes = useStyle();

  // React state to save other input
  const [otherInput, setOtherInput] = useState("");
  const [otherError, setOtherError] = useState(false);
  const handleOtherChange = (e) => {
    const val = e.target.value;
    setOtherInput(val);
    setdocType("Other");
  };

  // React state to get Document name
  const [docName, setDocName] = useState("");
  const [docError, setDocError] = useState(false);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setDocName(val);
  };

  // Clear the input field
  const clearInput = () => setDocName("");

  // Get filename from the picked file
  const getFileName = (e) => {
    const fileList = e.target.files;
    if (fileList.length) setDocName(fileList[0].name);
  };

  // React state to get Document type
  const [docType, setdocType] = useState("");
  const handleRadioChange = (e) => setdocType(e.target.value);

  // On submit listener
  const handleSubmit = (e) => {
    setDocError(docName === "");
    setOtherError(docType === "Other" && otherInput === "");

    if (docName === "" || (docType === "Other" && otherInput === "")) return;

    onSelect(docType === "Other" ? otherInput : docType, docName);
  };

  return (
    <DialogBox
      fullWidth
      maxWidth="xs"
      open={open}
      title={
        <>
          <Typography display="inline" variant="h6">
            Upload files
          </Typography>
          <CloseButton
            click={onClose}
            size="small"
            color="secondary"
            variant="contained"
          />
        </>
      }
      titleProp={{
        className: classes.titleContainer,
        disableTypography: true,
      }}
      content={
        <Box>
          <input
            id="supporting-doc"
            type="file"
            accept="*"
            onChange={getFileName}
            hidden
          />
          <Box display="flex" alignItems="center">
            <Tooltip title="Select Document">
              <Button
                htmlFor="supporting-doc"
                component="label"
                startIcon={<Icon>file_upload</Icon>}
                color="primary"
                variant="contained"
                className={classes.uploadButton}
                size="large"
              />
            </Tooltip>
            <TextControl
              gutter={false}
              size="small"
              variant="standard"
              label="Document Name"
              value={docName}
              onChange={handleInputChange}
              error={docError ? "This field is required." : ""}
              fullWidth
            />
            <Tooltip title="clear">
              <Box>
                <CloseButton type="text" size="small" click={clearInput} />
              </Box>
            </Tooltip>
          </Box>
          <Box paddingY={1}>
            <RadioControl
              direction="row"
              options={[
                ...options,
                {
                  val: "Other",
                  text: (
                    <TextControl
                      label="Other"
                      size="small"
                      variant="standard"
                      gutter={false}
                      value={otherInput}
                      onChange={handleOtherChange}
                      error={otherError ? "This field is required." : ""}
                    />
                  ),
                },
              ]}
              value={docType}
              onChange={handleRadioChange}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Icon>add</Icon>}
            onClick={handleSubmit}
          >
            Add Document
          </Button>
        </Box>
      }
      contentProp={{ style: { paddingLeft: "12px", paddingRight: "12px" } }}
    />
  );
};

function SupportingDocuments({ value, onChange, options }) {
  const classes = useStyle();

  const [openDialog, setOpenDialog] = useState(false);
  const OpenDialog = () => setOpenDialog(true);
  const CloseDialog = () => setOpenDialog(false);

  // Method to split & trim string
  const split = (lst, str) => {
    const opt = lst.split(str).map((val) => val.trim());
    return opt.length === 1 && opt[0] === "" ? [] : opt;
  };

  // Method to get index of file
  const getIndex = (val, doc) => {
    let found = -1;
    for (let i = 0; i < val.length; i++)
      if (val[i].type === doc) {
        found = i;
        break;
      }
    return found;
  };

  // Method to check to document already exit or not
  const isExist = (val, type, doc) => {
    let found = -1;
    for (let i = 0; i < val.length; i++)
      if (val[i].type === type) {
        found = i;
        break;
      }

    if (found === -1) return false;

    let exist = false;
    for (let i = 0; i < val[found].list.length; i++)
      if (val[found].list[i] === doc) {
        exist = true;
        break;
      }

    return exist;
  };

  // Method to convert string to Documents object
  const getDocsFromString = (str) =>
    split(str, "\n").map((val) => {
      const [docType, docs] = split(val, ":");
      const docList = split(docs, ",").filter((v) => v);
      return {
        type: docType,
        list: docList,
      };
    });

  // Method to convert Documents object to string
  const mapDocsToString = (docs) =>
    docs
      .map(
        ({ type, list }) =>
          `${type} : ${list.length ? list.join(", ") : "None"}`
      )
      .join("\n");

  // Method to add Doc to given document string
  const addDocToList = (type, doc) => {
    const temp = getDocsFromString(value);

    // Check if valid
    if (!type || !doc) return temp;
    if (isExist(temp, type, doc)) return temp;

    // Get existing type index
    const typeIndex = getIndex(temp, type);

    // Add document
    if (typeIndex !== -1) temp[typeIndex].list.push(doc);
    else temp.push({ type, list: [doc] });
    return temp;
  };

  // Method to remove doc from document string
  const removeDoc = (type, index) => {
    const temp = getDocsFromString(value);
    const typeIndex = getIndex(temp, type);
    temp[typeIndex].list = temp[typeIndex].list.filter((v, i) => i !== index);
    if (temp[typeIndex].list.length === 0)
      return temp.filter((v, i) => i !== typeIndex);
    return temp;
  };

  return (
    <List className={classes.documentList}>
      {openDialog && (
        <DocumentSelect
          open={openDialog}
          onClose={CloseDialog}
          onSelect={(type, doc) => {
            onChange(mapDocsToString(addDocToList(type, doc)));
            CloseDialog();
          }}
          options={options}
        />
      )}
      <ListItem>
        <Box width={1} overflow="hidden">
          {getDocsFromString(value).map(({ type, list }) =>
            list.map((doc, index) => (
              <DocumentChip
                key={index}
                type={type}
                doc={doc}
                onDelete={() =>
                  onChange(mapDocsToString(removeDoc(type, index)))
                }
              />
            ))
          )}
        </Box>
      </ListItem>
      <ListItem>
        <Button color="primary" variant="contained" onClick={OpenDialog}>
          Add File
        </Button>
      </ListItem>
    </List>
  );
}

export default SupportingDocuments;
