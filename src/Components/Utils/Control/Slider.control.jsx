import { FormControl, FormLabel, Slider } from "@material-ui/core";
import { controlledName } from "../Utils";
import { getLabel } from "./Controls.utils.js";
import { Field } from "./Form";
import PropTypes from "prop-types";
import { forwardRef } from "react";

// Get Slider input
const SliderControl = forwardRef((props, ref) => {
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
            ref={ref}
            step={returnLabel ? null : step}
            marks={markers}
            {...controls?.field}
            value={getValue(controls, value)}
            onChange={(_, val) => setValue(val, controls, onChange)}
            {...other}
            data-test="slider-container"
          />
        </FormControl>
      )}
    />
  );
});
SliderControl.propTypes = {
  name: controlledName,
  controls: PropTypes.object,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
  returnLabel: PropTypes.bool,
};

export default SliderControl;
