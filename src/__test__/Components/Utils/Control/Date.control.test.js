import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { mount } from "enzyme";
import React from "react";
import DateControl from "../../../../Components/Utils/Control/Date.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<DateControl />", () => {
  const setup = (props) => {
    const defaultProps = { onChange: jest.fn() };
    return mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateControl {...defaultProps} {...props} />
      </MuiPickersUtilsProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Date Input render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Date Input render with props without error", () => {
    testProps(DateControl, {
      name: "date",
      controls: {},
      onChange: jest.fn(),
    });
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputContainer = findByAttr(wrapper, "date-container").first();
    expect(inputContainer.props()).toEqual(expect.objectContaining(rest));
  });
});
