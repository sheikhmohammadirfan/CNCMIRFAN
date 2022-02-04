import React, { useState } from "react";
import { Button, Icon, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Controller, useFormContext } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  fileList: {
    "&:not(:last-of-type)": {
      marginRight: 4,
    },
  },
  tagCloseIcon: {
    textAlign: "center",
    fontSize: "0.85rem",
    color: theme.palette.primary.dark,
    borderRadius: "50%",
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.secondary.dark,
      color: "#fff",
    },
  },
}));

export default function FormAttachment({ name, control }) {
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const methods = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <>
          <Button color="primary" type="file" component="label">
            upload
            <Icon style={{ marginLeft: "4px", fontSize: "18px" }}>
              attachment
            </Icon>
            <input
              multiple
              {...methods.register(name)}
              type="file"
              onChange={(e) => {
                setSelectedFiles(Array.from(e.target.files));
                onChange(Array.from(e.target.files));
              }}
              hidden
            />
          </Button>
          <div>
            {selectedFiles.length > 0 &&
              selectedFiles.map((file, index) => {
                return (
                  <Chip
                    style={{ overflow: "hidden" }}
                    className={classes.fileList}
                    color="primary"
                    key={index}
                    label={file.name}
                    variant="outlined"
                    // deleteIcon={<span className={classes.tagCloseIcon}>x</span>}
                    // onDelete={() => removeFile(index)}
                  />
                );
              })}
          </div>
        </>
      )}
    />
  );
}
