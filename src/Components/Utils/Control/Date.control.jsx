import { Icon, InputAdornment } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { checkNameProps } from "../Utils";
import { getError, getLabel } from "./ControlsUtils";
import { Field } from "./Form";
import PropTypes from "prop-types";

// Get Datepicker
function DateControl(props) {
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
          data-test="date-container"
        />
      )}
    />
  );
}
DateControl.propTypes = {
  name: checkNameProps,
  controls: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default DateControl;
