import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { controlledName } from "../Utils";
import { getLabel } from "./Controls.utils.js";
import { Field } from "./Form";
import PropTypes from "prop-types";
import { forwardRef } from "react";

// Radiocontrol state
const RadioControl = forwardRef((props, ref) => {
  return (
    <Field
      {...props}
      field={({
        name,
        label = "",
        direction,
        options,
        hideLabel = false,
        controls,
        styleProps,
        radioGroupProps,
        radioProps,
        ...others
      }) => (
        <FormControl {...styleProps}>
          {!hideLabel && (
            <FormLabel component="legend" data-test="radio-label">
              {getLabel(label, name)}
            </FormLabel>
          )}
          <RadioGroup
            ref={ref}
            row={direction === "row"}
            {...controls?.field}
            {...radioGroupProps}
            {...others}
            data-test="radio-input"
          >
            {options.map((val, index) => (
              <FormControlLabel
                value={val?.val !== undefined ? val.val : val}
                key={index}
                control={<Radio {...radioProps} />}
                label={val?.text !== undefined ? val.text : val}
                data-test={`radio-option-${val?.val ? val.val : val}`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
});
RadioControl.propTypes = {
  name: controlledName,
  controls: PropTypes.object,
  direction: PropTypes.oneOf(["row", "column"]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        val: PropTypes.string.isRequired,
        text: PropTypes.any.isRequired,
      }),
      PropTypes.string,
    ])
  ).isRequired,
};

export default RadioControl;
