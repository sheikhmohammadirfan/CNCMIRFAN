import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Controller } from "react-hook-form";
const DATE_FORMAT = "yyyy-MM-DD";

export const FormDateInput = ({ name, control, label, defaultValue }) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
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
