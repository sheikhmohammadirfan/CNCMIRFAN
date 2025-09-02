import { shallow } from "enzyme";
import React from "react";
import SelectControl from "../../../../Components/Utils/Control/Select.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<SelectControl />", () => {
  const setup = (props) => {
    const defaultProps = {
      options: ["a", "b", { val: "d", text: "d" }],
      name: "Dropdown",
      value: "",
    };
    return shallow(<SelectControl {...defaultProps} {...props} />).dive();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Select render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Select render with props without error", () => {
    testProps(SelectControl, {
      name: "Dropdown",
      controls: {},
      options: ["a", "b", { val: "d", text: "d" }],
    });
  });

  test("Test options generate correctly", () => {
    const wrapper = setup({ options: ["a", "b", { val: "c", text: "c" }] });

    // Test 1st option
    const first_option = findByAttr(wrapper, "select-option-a");
    expect(first_option.exists()).toBeTruthy();

    // Test 2nd option
    const second_option = findByAttr(wrapper, "select-option-b");
    expect(second_option.exists()).toBeTruthy();

    // Test 3rd option
    const third_option = findByAttr(wrapper, "select-option-c");
    expect(third_option.exists()).toBeTruthy();
  });

  test("Test onChange props is called with proper value", () => {
    const mock_onChange = jest.fn();

    // Trigger change event
    const wrapper = setup({ onChange: mock_onChange });
    const inputField = findByAttr(wrapper, "select-input");
    inputField.simulate("change", "value");

    expect(mock_onChange).toBeCalledWith("value");
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputContainer = findByAttr(wrapper, "select-input");
    expect(inputContainer.props()).toEqual(expect.objectContaining(rest));
  });
});
