import React, { useState } from "react";
import { withStyles, Chip, Icon } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import { TextControl } from "../Utils/Control";

// Custom Chip to show label
const LabelChip = withStyles((theme) => ({
  root: {
    margin: theme.spacing(1 / 4),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
    background: theme.palette.grey[100],
  },
  deleteIcon: { fontSize: "1.2rem" },
}))(({ label, onDelete, ...rest }) => (
  <Chip
    size="small"
    label={label}
    deleteIcon={<Icon>clear</Icon>}
    onDelete={onDelete}
    {...rest}
  />
));

// Main assignee text field
export default function SelectLabels({ name, label, control, rules, ...rest }) {
  // State to save option to show in dropdown
  const [optionList, setOptionList] = useState([]);
  // Add new value in option
  const addOptions = (newList) =>
    setOptionList((prevList) => [
      ...prevList,
      ...newList.filter((val) => !optionList.includes(val)),
    ]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Autocomplete
          value={value}
          onChange={(e, newVal) => {
            addOptions(newVal);
            onChange(newVal);
          }}
          options={optionList}
          getOptionLabel={(option) => option}
          freeSolo
          multiple
          filterSelectedOptions
          renderTags={(value, props) =>
            value.map((label, index) => (
              <LabelChip label={label} onDelete={props({ index }).onDelete} />
            ))
          }
          renderInput={(params) => (
            <TextControl
              {...params}
              variant="outlined"
              size="small"
              label={label}
              noControls={true}
              gutter={false}
            />
          )}
          {...rest}
        />
      )}
    />
  );
}
