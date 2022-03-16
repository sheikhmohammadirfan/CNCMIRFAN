import { useState, forwardRef } from "react";
import { Field } from "../Form";
import { RenderChildren } from "./RenderChildren";
import { RenderDragNDrop } from "./RenderDragNDrop";
import { RenderListContainer } from "./RenderListContainer";
import { RenderListItem } from "./RenderListItem";
import PropTypes from "prop-types";

/* UPLOAD CONTROL INPUT */
const UploadControl = forwardRef((props, ref) => {
  // State to manage drag n drop dialog visibility
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDragDialog = () => setDialogOpen(true);
  const closeDragDialog = () => setDialogOpen(false);

  // List of selected files to populate on next select
  const [selectFiles, setSelectFiles] = useState([]);

  // Method to check if a file is already selected
  const checkFileExist = (test) =>
    selectFiles.find(
      (file) =>
        file.name === test.name && file.lastModified === test.lastModified
    ) !== undefined;

  // Method to set on change value
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
        onChange = () => {},
        multiple = true,
        extensions = [],
        hideButtons = false,
        children,
        hideFileList = false,
        listRef,
        listContainer,
        listItem,
        hideDragNDrop = true,
        dragRef,
        dragContainer,
        dragContent,
        controls,
        ...others
      }) => {
        // Select Form onChange or default onChange
        const setter = controls?.field.onChange || onChange;

        return (
          <>
            <input
              ref={ref}
              multiple={multiple}
              id={`${name.replaceAll(" ", "_")}-id`}
              type="file"
              accept={extensions ? extensions.join(", ") : "*/*"}
              {...controls?.field}
              {...others}
              value=""
              onChange={(e) => setValue(e.target.files, multiple, setter)}
              hidden
              data-test="upload-input"
            />

            {!hideButtons && (
              <RenderChildren
                children={children}
                fileList={selectFiles}
                trigger={() => inputTrigger(name)}
                removeAll={() => removeAllFiles(setter)}
                openDrag={openDragDialog}
                hideDragNDrop={Boolean(
                  hideDragNDrop || dragContainer || dragRef
                )}
                data-test="upload-button"
              />
            )}

            {!hideDragNDrop && (
              <RenderDragNDrop
                trigger={() => inputTrigger(name)}
                onChange={(files) => setValue(files, multiple, setter)}
                dialogOpen={dialogOpen}
                closeDrag={closeDragDialog}
                container={dragContainer}
                containerRef={dragRef}
                content={dragContent}
                data-test="upload-drag-n-drop"
              />
            )}

            {!hideFileList && (
              <RenderListContainer
                container={listContainer}
                containerRef={listRef}
                listItems={selectFiles.map((file, index) => (
                  <RenderListItem
                    key={index}
                    listItem={listItem}
                    fileName={file.name}
                    index={index}
                    removeFile={() => removeFileAtIndex(index, setter)}
                    data-test="upload-file-item"
                  />
                ))}
                data-test="upload-file-list"
              />
            )}
          </>
        );
      }}
    />
  );
});
UploadControl.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UploadControl;
