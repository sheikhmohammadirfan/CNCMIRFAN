import React, { useState } from "react";
import { withStyles, Chip, Icon, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";

// Custom Chip to show label
const TagChip = withStyles((theme) => ({
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

// List of Chip tags
const tagsList = (lst, propsLst) =>
  lst.map((label, index) => (
    <TagChip
      key={index}
      label={label}
      onDelete={propsLst({ index }).onDelete}
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
      render={({ field: { value, onChange } }) => {
        // Method to change autocomple input
        const setAutocomplete = (val) => {
          addOptions(val);
          onChange(val);
        };

        return (
          <Autocomplete
            size="small"
            freeSolo
            multiple
            value={value}
            onChange={(e, newVal) => setAutocomplete(newVal)}
            options={optionList}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            disableClearable
            renderTags={tagsList}
            renderInput={(params) => (
              <TextField variant="outlined" label={label} {...params} />
            )}
            {...rest}
          />
        );
      }}
    />
  );
}
