import { Checkbox, FormControlLabel, withStyles } from "@material-ui/core";
import { checkNameProps } from "../Utils";
import { getLabel } from "./ControlsUtils";
import { Field } from "./Form";
import PropTypes from "prop-types";
import { forwardRef } from "react";

// Get checkbox, with label
const CheckboxControl = withStyles({ root: { margin: 0 } })(
  forwardRef((props, ref) => (
    <Field
      {...props}
      field={({ color = "default", name, label, controls, ...others }) => (
        <FormControlLabel
          control={
            <Checkbox
              ref={ref}
              color={color}
              inputProps={{ "data-test": "checkbox-input" }}
            />
          }
          label={getLabel(label, name)}
          checked={controls?.field.value}
          {...controls?.field}
          {...others}
          data-test="checkbox-container"
        />
      )}
    />
  ))
);
CheckboxControl.propTypes = {
  name: checkNameProps,
  controls: PropTypes.object,
};

export default CheckboxControl;
