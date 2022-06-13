import { shallow } from "enzyme";
import React from "react";
import RadioControl from "../../../../Components/Utils/Control/Radio.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<RadioControl />", () => {
  const setup = (props) => {
    const defaultProps = { options: ["a", "b", "c", { val: "d", text: "d" }] };
    return shallow(<RadioControl {...defaultProps} {...props} />)
      .dive()
      .dive();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Radio render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Radio render with props without error", () => {
    testProps(RadioControl, {
      name: "radio",
      controls: {},
      direction: "row",
      options: ["a", "b", "c", { val: "d", text: "d" }],
    });
  });

  test("Test hide label is working properly", () => {
    const wrapper = setup({ hideLabel: true });
    const label = findByAttr(wrapper, "radio-label");
    expect(label.exists()).toBeFalsy();
  });

  test("Test options generate correctly", () => {
    const wrapper = setup({ options: ["a", "b", { val: "c", text: "c" }] });

    // Test 1st option
    const first_option = findByAttr(wrapper, "radio-option-a");
    expect(first_option.exists()).toBeTruthy();

    // Test 2nd option
    const second_option = findByAttr(wrapper, "radio-option-b");
    expect(second_option.exists()).toBeTruthy();

    // Test 3rd option
    const third_option = findByAttr(wrapper, "radio-option-c");
    expect(third_option.exists()).toBeTruthy();
  });

  test("Test onChange method is called without error", () => {
    const mock_onChange = jest.fn();
    const wrapper = setup({ onChange: mock_onChange });

    // Trigger change event
    const inputField = findByAttr(wrapper, "radio-input");
    inputField.simulate("change", "value");

    expect(mock_onChange).toBeCalledWith("value");
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputContainer = findByAttr(wrapper, "radio-input");
    expect(inputContainer.props()).toEqual(expect.objectContaining(rest));
  });
});
