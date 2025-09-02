import { shallow } from "enzyme";
import React from "react";
import SliderControl from "../../../../Components/Utils/Control/Slider.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<SliderControl />", () => {
  const setup = (props) => {
    const defaultProps = { onChange: jest.fn() };
    return shallow(<SliderControl {...defaultProps} {...props} />).dive();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Select render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Select render with props without error", () => {
    testProps(SliderControl, {
      name: "Dropdown",
      controls: {},
      markers: [
        { label: "zero", value: "0" },
        { label: "fifty", value: "50" },
        { label: "hundred", value: "100" },
      ],
      onChange: jest.fn(),
      returnLabel: false,
    });
  });

  test("Test onChange method is called without error", () => {
    const mock_onChange = jest.fn();
    const wrapper = setup({ onChange: mock_onChange });

    // Trigger change event
    const sliderInput = findByAttr(wrapper, "slider-container").dive();
    sliderInput.simulate("change", {}, 10);

    expect(mock_onChange).toBeCalledWith(10);
  });

  test("Test markers generated properly", () => {
    const markers = [
      { label: "zero", value: "0" },
      { label: "fifty", value: "50" },
      { label: "hundred", value: "100" },
    ];
    const wrapper = setup({ markers });

    // Test marks shape
    const sliderInput = findByAttr(wrapper, "slider-container").dive();
    expect(sliderInput.props().marks).toEqual(markers);
  });

  test("Test Slider will save marker value when returnLabel is set", () => {
    const mock_onChange = jest.fn();
    const wrapper = setup({
      returnLabel: true,
      onChange: mock_onChange,
      markers: [
        { label: "zero", value: "0" },
        { label: "fifty", value: "50" },
        { label: "hundred", value: "100" },
      ],
    });

    // Test is step props is null
    const sliderInput = findByAttr(wrapper, "slider-container").dive();
    expect(sliderInput.props().step).toBeNull();

    // Trigger change event
    sliderInput.simulate("change", {}, 10);

    expect(mock_onChange).toBeCalledWith("");
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputContainer = findByAttr(wrapper, "slider-container");
    expect(inputContainer.props()).toEqual(expect.objectContaining(rest));
  });
});
