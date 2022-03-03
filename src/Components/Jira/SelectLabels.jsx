import React, { useState, useRef } from "react";
import { withStyles, Chip, Icon } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";
import { TextControl } from "../Utils/Control";

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

// Custom input field
const TextInput = ({ label, params, onChange }) => {
  // Select input on space press
  params.inputProps.onKeyDown = (e) => {
    if (e.key === " " && e.target.value) onChange(e.target.value);
  };
  // Select input on going outside of input field
  params.inputProps.onBlur = (e) => {
    if (e.target.value) onChange(e.target.value);
  };
  // Trim input to remove extra spaces
  params.inputProps.value = params.inputProps.value?.trim();

  return (
    <TextControl
      {...params}
      variant="outlined"
      size="small"
      label={label}
      noControls={true}
      gutter={false}
      defaultValue="hello"
    />
  );
};

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

        // Method to change text input
        const setTextcontrol = (newVal) => {
          let valLst = [];
          if (value?.length > 0) valLst = [...value];
          if (!valLst.includes(newVal)) valLst.push(newVal);
          setAutocomplete(valLst);
        };

        return (
          <Autocomplete
            freeSolo
            multiple
            value={value}
            onChange={(e, newVal) => setAutocomplete(newVal)}
            options={optionList}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            renderTags={tagsList}
            renderInput={(params) => (
              <TextInput label={label} params={params} onChange={setTextcontrol} />
            )}
            {...rest}
          />
        );
      }}
    />
  );
}
