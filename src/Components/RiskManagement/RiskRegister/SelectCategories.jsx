import { TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

const SelectCategories = ({
  name,
  label,
  control,
  rules,
  multiple,
  optionList,
  disabled,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules[name]}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <Autocomplete
            size="medium"
            multiple={multiple}
            value={value || []}
            onChange={(e, newVal) => !disabled && onChange(newVal)}
            options={!disabled ? optionList : []}
            getOptionLabel={(option) => option.category_name}
            filterSelectedOptions
            loading={true}
            loadingText={disabled ? "Can't be changed" : "Not Found"}
            renderInput={(params) => (
              <TextField
                error={Boolean(error)}
                helperText={error ? error.message : ""}
                size="medium"
                variant="outlined"
                label={label}
                {...params}
              />
            )}
            disabled={disabled}
            {...rest}
          />
        );
      }}
    />
  );
};

export default SelectCategories;
