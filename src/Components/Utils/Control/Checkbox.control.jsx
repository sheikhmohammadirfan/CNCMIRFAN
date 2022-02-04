import { Checkbox, FormControlLabel, withStyles } from "@material-ui/core";
import { getLabel } from "../Utils";
import { Field } from "./Form";

// Get checkbox, with label
const CheckboxControl = withStyles({ root: { margin: 0 } })((props) => (
  <Field
    {...props}
    field={({ color = "default", name, label, controls, ...others }) => (
      <FormControlLabel
        control={<Checkbox color={color} />}
        label={getLabel(label, name)}
        checked={controls?.field.value}
        {...controls?.field}
        {...others}
      />
    )}
  />
));

export default CheckboxControl;
