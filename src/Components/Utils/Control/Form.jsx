import { createContext, useContext } from "react";
import { Controller } from "react-hook-form";

// Create controller context
const ControllerContext = createContext({
  control: null,
  rules: {},
  controlProps: {},
});

// Form compoenent to provide Control & form wrapper children form elements
export default function Form({
  children,
  control,
  rules = {},
  controlProps = {},
  ...rest
}) {
  return (
    <form {...rest}>
      <ControllerContext.Provider value={{ control, rules, controlProps }}>
        {children}
      </ControllerContext.Provider>
    </form>
  );
}

// Map child component into a controller if control props is passed
function Field({ field, noControls, ...rest }) {
  // Get control form props
  const restControl = {
    control: rest.control,
    rules: rest.rules,
    controlProps: rest.controlProps,
  };

  // Get control from form context
  const formControl = useContext(ControllerContext);

  const { control, rules, controlProps } = restControl.control
    ? restControl
    : formControl;

  return control && !noControls ? (
    <Controller
      name={rest.name}
      control={control}
      rules={rules[rest.name]}
      {...controlProps}
      render={(controls) => field({ controls, ...rest })}
    />
  ) : (
    field(rest)
  );
}

export { Field };
