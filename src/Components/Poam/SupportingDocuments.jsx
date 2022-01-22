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
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, RadioControl, TextControl } from "../Control";
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

  // Default values of the RHF
  const defaultValues = {
    "Document Name": "",
    "Document Type": "Other",
    "Other Name": "",
  };

  // Validation for input fields
  const validation = {
    "Document Name": { required: "This field is required." },
    "Document Type": { required: "This field is required." },
    "Other Name": {
      validate: {
        requiredIfOther: (val) =>
          !(getValues("Document Type") === "Other" && val === "") ||
          "This field is required.",
      },
    },
  };

  // Get object
  const { handleSubmit, control, reset, getValues, setValue, watch } = useForm({
    defaultValues,
  });

  // Watch Other Name, to update radio if any value is filled
  const watchOther = watch("Other Name");
  useEffect(() => {
    if (watchOther !== "" && getValues("Document Type") !== "Other")
      setValue("Document Type", "Other");
  }, [watchOther]);

  // Get filename from the picked file
  const getFileName = (e) => {
    const fileList = e.target.files;
    if (fileList.length) setValue("Document Name", fileList[0].name);
  };

  // Clear the input field
  const clearInput = () => setValue("Document Name", "");

  // Return name of selected documents
  const submitDoc = (data) =>
    onSelect(
      data["Document Type"] === "Other"
        ? data["Other Name"]
        : data["Document Type"],
      data["Document Name"]
    );

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
          <Form control={control} rules={validation}>
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
                name="Document Name"
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
                name="Document Type"
                options={[
                  ...options,
                  {
                    val: "Other",
                    text: (
                      <TextControl
                        name="Other Name"
                        label="Other"
                        size="small"
                        variant="standard"
                        gutter={false}
                      />
                    ),
                  },
                ]}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Icon>add</Icon>}
              onClick={handleSubmit(submitDoc)}
            >
              Add Document
            </Button>
          </Form>
        </Box>
      }
      contentProp={{ style: { paddingLeft: "12px", paddingRight: "12px" } }}
    />
  );
};

function SupportingDocuments({ name, control, options }) {
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
  const addDocToList = (value, type, doc) => {
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
  const removeDoc = (value, type, index) => {
    const temp = getDocsFromString(value);
    const typeIndex = getIndex(temp, type);
    temp[typeIndex].list = temp[typeIndex].list.filter((v, i) => i !== index);
    if (temp[typeIndex].list.length === 0)
      return temp.filter((v, i) => i !== typeIndex);
    return temp;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <List className={classes.documentList}>
          {openDialog && (
            <DocumentSelect
              open={openDialog}
              onClose={CloseDialog}
              onSelect={(type, doc) => {
                onChange(mapDocsToString(addDocToList(value, type, doc)));
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
                      onChange(mapDocsToString(removeDoc(value, type, index)))
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
      )}
    />
  );
}

export default SupportingDocuments;
