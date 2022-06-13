import { mount } from "enzyme";
import React from "react";
import CheckboxControl from "../../../../Components/Utils/Control/Checkbox.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<CheckboxControl />", () => {
  const setup = (props) => {
    const defaultProps = {};
    return mount(<CheckboxControl {...defaultProps} {...props} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Checkbox render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Checkbox render with props without error", () => {
    testProps(CheckboxControl, { name: "check", controls: {} });
  });

  test("Checkbox is uncheck by default", () => {
    const wrapper = setup();
    const checkboxContainer = findByAttr(wrapper, "checkbox-container").first();
    expect(checkboxContainer.props.checked).toBeFalsy();
  });

  test("Checkbox toggle check without error", () => {
    const mock_onChange = jest.fn();
    const wrapper = setup({ onChange: mock_onChange });

    // Trigger change event
    const inputField = findByAttr(wrapper, "checkbox-input");
    inputField.simulate("change");

    expect(mock_onChange).toBeCalled();
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputContainer = findByAttr(wrapper, "checkbox-container").first();
    const props = inputContainer.props();
    delete props.control;
    expect(props).toEqual(expect.objectContaining(rest));
  });
});
