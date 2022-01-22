import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Controller } from "react-hook-form";
const DATE_FORMAT = "yyyy-MM-dd";

export const FormDateInput = ({ name, control, label, defaultValue }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        initialFocusedDate={null}
        defaultValue={null}
        render={({ field: { onChange, value } }) => (
          <KeyboardDatePicker
            style={{ display: "block" }}
            format={DATE_FORMAT}
            value={value}
            onChange={onChange}
            label={label}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
};
