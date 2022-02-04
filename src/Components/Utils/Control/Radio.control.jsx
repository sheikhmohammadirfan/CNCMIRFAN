import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { getLabel } from "../Utils";
import { Field } from "./Form";

// Radiocontrol state
export default function RadioControl(props) {
  return (
    <Field
      {...props}
      field={({
        name = "",
        label = "",
        direction = "",
        options,
        hideLabel = false,
        controls,
        styleProps,
        ...others
      }) => (
        <FormControl {...styleProps}>
          {!hideLabel && (
            <FormLabel component="legend">{getLabel(label, name)}</FormLabel>
          )}
          <RadioGroup
            row={direction === "row"}
            {...controls?.field}
            {...others}
          >
            {options.map((val, index) => (
              <FormControlLabel
                value={val?.val ? val.val : val}
                key={index}
                control={<Radio />}
                label={val?.text ? val.text : val}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}
