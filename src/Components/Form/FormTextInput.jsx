import React from "react";
import { TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";

export default function FormTextInput({
  name,
  control,
  label,
  required,
  type,
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
          style={{ margin: "0.8rem 0" }}
          helperText={invalid ? "This field is required" : ""}
          size="small"
          error={invalid}
          fullWidth
          variant="outlined"
          onChange={onChange}
          value={value}
          label={label}
        />
      )}
    />
  );
}
