import React from "react";
import { TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";

export default function FormTextInput({
  name,
  control,
  label,
  required,
  type,
  defaultValue,
  disabled,
}) {
  return (
    <Controller
      rules={{ required: required }}
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { invalid } }) => (
        <TextField
          type={type || ""}
          required
          disabled={disabled || false}
          style={{ margin: "0.8rem 0" }}
          helperText={invalid ? "This field is required" : ""}
          size="small"
          error={invalid}
          fullWidth
          defaultValue={defaultValue || null}
          variant="outlined"
          onChange={onChange}
          value={value}
          label={label}
        />
      )}
    />
  );
}
