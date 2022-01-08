import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Controller } from "react-hook-form";

export default function FormDropDown({
  name,
  control,
  label,
  options,
  required,
}) {
  const generateSingleOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };
  return (
    <FormControl
      size="small"
      style={{ display: "block", margin: "0.5rem 0", width: "60%" }}
    >
      <label htmlFor="">{label}</label>

      <Controller
        rules={{ required: required || false }}
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { invalid } }) => (
          <Select
            required={required ? true : ""}
            error={invalid}
            variant="outlined"
            fullWidth
            onChange={onChange}
            value={value}
            displayEmpty
          >
            <MenuItem value="">
              <em style={{ color: "#888" }}>select an option</em>
            </MenuItem>
            {generateSingleOptions()}
          </Select>
        )}
      />
    </FormControl>
  );
}
