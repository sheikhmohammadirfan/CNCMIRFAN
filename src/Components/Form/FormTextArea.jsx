import React from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  messageText: {
    minHeight: "5rem",
    padding: "0.4rem 0.4rem",
    "&::placeholder": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function FormTextArea({
  name,
  control,
  label,
  required,
  defaultValue,
}) {
  const classes = useStyles();
  return (
    <Controller
      rules={{ required: required }}
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { invalid } }) => (
        <TextField
          required
          style={{ marginTop: "1rem" }}
          multiline
          helperText={invalid ? "This field is required" : ""}
          size="small"
          error={invalid}
          fullWidth
          placeholder="Enter your message here"
          variant="outlined"
          onChange={onChange}
          value={value}
          defaultValue={defaultValue || null}
          label={label}
          InputProps={{
            classes: { input: classes.messageText },
          }}
        />
      )}
    />
  );
}
