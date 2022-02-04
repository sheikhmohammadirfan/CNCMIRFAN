import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { Field } from "./Form";

const useStyle = makeStyles((theme) => ({
  fileListItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[400]}`,
    borderBottom: "none",
    "&:last-child": { borderBottom: `1px solid ${theme.palette.grey[400]}` },
    "&:hover": {
      borderColor: theme.palette.grey[600],
      "& + *": { borderTopColor: theme.palette.grey[600] },
    },
    "& .MuiTypography-root": { flexGrow: 1 },
    "& .MuiIcon-root": { fontSize: "1.2rem" },
  },
}));

// Method to reder default button trigger as children or return function with trigger parameter
const RenderChildren = ({ children, trigger, removeAll, fileList }) =>
  children ? (
    children(trigger, removeAll)
  ) : (
    <ButtonGroup size="small">
      <Button startIcon={<Icon>attach_file</Icon>} onClick={trigger}>
        Attachment
      </Button>
      {fileList.length > 0 && (
        <Tooltip arrow title="Remove All Attachment">
          <Button onClick={removeAll}>
            <Icon>delete_sweep</Icon>
          </Button>
        </Tooltip>
      )}
    </ButtonGroup>
  );

// Method to render List as filelist container or return function with list of rendered options
const RenderListContainer = ({ container, listItems, fileList }) =>
  container
    ? container(listItems)
    : fileList.length > 0 && (
        <List component={Box} maxWidth={300} overflow="hidden">
          <Typography>Attachment List</Typography>
          {listItems}
        </List>
      );

// Method to render list item
const RenderListItem = ({ listItem, fileName, index, removeFile, classes }) =>
  listItem ? (
    listItem(fileName, index, removeFile)
  ) : (
    <ListItem className={classes} button dense>
      <Typography variant="body2" noWrap>
        {fileName}
      </Typography>
      <IconButton size="small" onClick={removeFile}>
        <Icon>clear</Icon>
      </IconButton>
    </ListItem>
  );

// Get Upload input
export default function UploadControl(props) {
  // Get css styles
  const classes = useStyle();

  // List of selected files to populate on next select
  const [selectFiles, setSelectFiles] = useState([]);

  // Method to check if a file is already selected
  const checkFileExist = (test) =>
    selectFiles.find(
      (file) =>
        file.name === test.name && file.lastModified === test.lastModified
    ) !== undefined;

  // update field value
  const setValue = (files, multiple, onChange) => {
    // if multiple file option is not selected then return imediately
    if (!multiple) return onChange(files[0]);
    // Generate a list of newly selected files
    const newFile = Object.values(files);

    // List to store on those file, which are not selected
    const uniqueFile = [];
    // Populate unique file
    for (let value of newFile)
      if (!checkFileExist(value)) uniqueFile.push(value);

    // Check if any unique file is selected then only update the state
    if (uniqueFile.length > 0)
      setSelectFiles((prevFile) => [...prevFile, ...uniqueFile]);
    // Update selected file list
    return onChange(
      uniqueFile.length > 0 ? [...selectFiles, ...uniqueFile] : selectFiles
    );
  };

  // Remove all selected files by
  const removeAllFiles = (onChange) => {
    setSelectFiles([]);
    onChange([]);
  };

  // Remove file at specific index
  const removeFileAtIndex = (index, onChange) =>
    setSelectFiles((file) => {
      const newVal = file.filter((v, idx) => idx !== index);
      onChange(newVal);
      return newVal;
    });

  // method to trigger input file selection dialog
  const inputTrigger = () =>
    document.getElementById(`${props.name.replaceAll(" ", "_")}-id`).click();

  return (
    <Field
      {...props}
      field={({
        name,
        onChange,
        multiple = true,
        extensions = [],
        children,
        listContainer,
        listItem,
        controls,
        ...others
      }) => (
        <>
          <input
            multiple={multiple}
            id={`${name.replaceAll(" ", "_")}-id`}
            type="file"
            accept={extensions ? extensions.join(", ") : "*/*"}
            {...controls?.field}
            {...others}
            value=""
            onChange={(e) =>
              setValue(
                e.target.files,
                multiple,
                controls?.field.onChange || onChange
              )
            }
            hidden
          />

          <RenderChildren
            children={children}
            trigger={() => inputTrigger(name)}
            removeAll={() =>
              removeAllFiles(controls?.field.onChange || onChange)
            }
            fileList={selectFiles}
          />

          <RenderListContainer
            fileList={selectFiles}
            container={listContainer}
            listItems={selectFiles.map((file, index) => (
              <RenderListItem
                key={index}
                listItem={listItem}
                fileName={file.name}
                index={index}
                removeFile={() =>
                  removeFileAtIndex(index, controls?.field.onChange || onChange)
                }
                classes={classes.fileListItem}
              />
            ))}
          />
        </>
      )}
    />
  );
}
