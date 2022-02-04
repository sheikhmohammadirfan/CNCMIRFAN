import { FormControl, FormLabel, Slider } from "@material-ui/core";
import { getLabel } from "../Utils";
import { Field } from "./Form";

// Get Slider input
export default function SliderControl(props) {
  // Map marker label to numeric value
  const mapToValue = (label) =>
    props.markers.find((mark) => mark.label === label)?.value || 0;

  // Map numeric value to marker label
  const mapToLabel = (value) =>
    props.markers.find((mark) => mark.value === value)?.label || "";

  // Getter
  const getValue = (controls, value) => {
    const val = controls?.field.value || value;
    return props.returnLabel ? mapToValue(val) : val;
  };

  // Setter
  const setValue = (newVal, controls, onChange) => {
    const setter = controls?.field.onChange || onChange;
    setter(props.returnLabel ? mapToLabel(newVal) : newVal);
  };

  return (
    <Field
      {...props}
      field={({
        name,
        label,
        step = 1,
        markers = [],
        returnLabel = false,
        controls,
        styleProps,
        value,
        onChange,
        ...other
      }) => (
        <FormControl {...styleProps}>
          <FormLabel component="legend">{getLabel(label, name)}</FormLabel>
          <Slider
            step={returnLabel ? null : step}
            marks={markers}
            {...controls?.field}
            value={getValue(controls, value)}
            onChange={(_, val) => setValue(val, controls, onChange)}
            {...other}
          />
        </FormControl>
      )}
    />
  );
}
