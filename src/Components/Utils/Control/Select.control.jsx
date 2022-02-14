import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Field } from "./Form";
import { getLabel, getError } from "../Utils";

// Get dropdown input
export default function SelectControl(props) {
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
            labelId={`${name.replaceAll(" ", "-")}-id`}
            id={`${name.replaceAll(" ", "-")}`}
            label={getLabel(label, name)}
            error={Boolean(error || controls?.fieldState.error)}
            {...controls?.field}
            {...others}
          >
            {loading ? (
              <MenuItem disabled={true}>Loading...</MenuItem>
            ) : options.length === 0 ? (
              <MenuItem disabled={true}>No Options</MenuItem>
            ) : (
              options.map((val, index) => (
                <MenuItem
                  value={val?.val ? val.val : val}
                  key={index}
                  {...optionProps}
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
}
