import { Icon, InputAdornment } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { getError, getLabel } from "../Utils";
import { Field } from "./Form";

// Get Datepicker
export default function DateControl(props) {
  return (
    <Field
      {...props}
      field={({
        name = "date",
        label,
        icon = "calendar_today",
        iconPosition = "start",
        variant = "standard",
        error = "",
        gutter = false,
        controls,
        ...other
      }) => (
        <DatePicker
          label={getLabel(label, name)}
          variant={variant}
          inputVariant={variant}
          InputProps={{
            startAdornment: (
              <InputAdornment position={iconPosition}>
                <Icon>{icon}</Icon>
              </InputAdornment>
            ),
          }}
          error={Boolean(error || controls?.fieldState.error)}
          helperText={getError(error, controls?.fieldState.error, gutter)}
          {...controls?.field}
          {...other}
        />
      )}
    />
  );
}
