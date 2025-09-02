import React, { useState, forwardRef, useEffect, useRef } from "react";
import { Field } from "../Form";
import { RenderChildren } from "./RenderChildren";
import { RenderDragNDrop } from "./RenderDragNDrop";
import { RenderListContainer } from "./RenderListContainer";
import { RenderListItem } from "./RenderListItem";
import PropTypes from "prop-types";
import {
  addFiles,
  removeAllFiles,
  removeFileAtIndex,
} from "./UploadControl.utils";

/* UPLOAD CONTROL INPUT */
const UploadControl = forwardRef((props, ref) => {
  // State to manage drag n drop dialog visibility
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDragDialog = () => setDialogOpen(true);
  const closeDragDialog = () => setDialogOpen(false);

  // List of selected files to populate on next select
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  // Create template for input change method, to passed in useEffect
  // Added this function in useRef to prevent func from changing on re-render
  let changeInput = useRef(() => {});
  // Update input field, on state change
  useEffect(() => {
    if (props.multiple) changeInput.current(selectedFiles);
  }, [selectedFiles]);

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
        // Populate onChange, with onChange listener
        changeInput.current = controls?.field.onChange || onChange;

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
              onChange={(e) =>
                addFiles(
                  multiple,
                  e.target.files,
                  changeInput.current,
                  setSelectedFiles
                )
              }
              hidden
              data-test="upload-input"
            />

            {!hideButtons && (
              <RenderChildren
                children={children}
                fileList={selectedFiles}
                trigger={() => inputTrigger(name)}
                removeAll={() => removeAllFiles(setSelectedFiles)}
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
                onChange={(files) =>
                  addFiles(multiple, files, changeInput, setSelectedFiles)
                }
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
                listItems={selectedFiles.map((file, index) => (
                  <RenderListItem
                    key={index}
                    listItem={listItem}
                    fileName={file.name}
                    index={index}
                    removeFile={() =>
                      removeFileAtIndex(index, setSelectedFiles)
                    }
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
