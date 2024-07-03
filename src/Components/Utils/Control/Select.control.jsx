import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Field } from "./Form";
import { getLabel, getError } from "./Controls.utils.js";
import PropTypes from "prop-types";
import { forwardRef } from "react";

// Get dropdown input
const SelectControl = forwardRef((props, ref) => {
  return (
    <Field
      {...props}
      field={({
        name = "dropdown",
        variant = "standard",
        label = "",
        error = "",
        gutter,
        options,
        styleProps,
        optionProps,
        loading = false,
        controls,
        ...others
      }) => (
        <FormControl variant={variant} {...styleProps}>
          <InputLabel id={`${name.replaceAll(" ", "-")}-id`}>
            {getLabel(label, name)}
          </InputLabel>
          <Select
            ref={ref}
            labelId={`${name.replaceAll(" ", "-")}-id`}
            id={`${name.replaceAll(" ", "-")}`}
            label={getLabel(label, name)}
            error={Boolean(error || controls?.fieldState.error)}
            {...controls?.field}
            {...others}
            data-test="select-input"
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : options.length === 0 ? (
              <MenuItem disabled>No Options</MenuItem>
            ) : (
              options.map((val, index) => (
                <MenuItem
                  value={val?.val === undefined || val?.val === null ? val : val.val}
                  key={index}
                  {...optionProps}
                  data-test={`select-option-${val?.val === undefined || val?.val === null ? val : val.val}`}
                >
                  {val?.text ? val.text : val}
                </MenuItem>
              ))
            )}
          </Select>
          <FormHelperText error={Boolean(error || controls?.fieldState.error)}>
            {getError(error, controls?.fieldState.error, gutter)}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
});
SelectControl.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        val: PropTypes.string.isRequired,
        text: PropTypes.any.isRequired,
      }),
      PropTypes.string,
    ])
  ).isRequired,
  controls: PropTypes.object,
};

export default SelectControl;
