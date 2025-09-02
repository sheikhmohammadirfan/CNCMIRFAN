import { shallow } from "enzyme";
import React from "react";
import PasswordControl from "../../../../Components/Utils/Control/Password.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<PasswordControl />", () => {
  const setup = (props) => {
    const defaultProps = {};
    return shallow(<PasswordControl {...defaultProps} {...props} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Password input render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Password input render with props without error", () => {
    testProps(PasswordControl, { name: "password", controls: {} });
  });

  test("Password is hidden by default", () => {
    const wrapper = setup();
    expect(wrapper.props().type).toBe("password");
  });

  test("Password visibility toggles on btn click", () => {
    const wrapper = setup();

    // Simulate click event
    const togglerContainer = shallow(wrapper.props().InputProps.endAdornment);
    const togglerBtn = findByAttr(togglerContainer, "pasword-visibility-btn");
    togglerBtn.simulate("click");

    expect(wrapper.props().type).toBe("text");
  });

  test("Visibility toggler won't show, if forceHidden props are set", () => {
    const wrapper = setup({ forceHidden: true });
    const togglerContainer = shallow(wrapper.props().InputProps.endAdornment);
    expect(togglerContainer.props().style.display).toBe("none");
  });

  test("Password input changes without error", () => {
    const mock_onChange = jest.fn();

    // Trigger change event
    const wrapper = setup({ onChange: mock_onChange });
    wrapper.simulate("change");

    expect(mock_onChange).toBeCalled();
  });
});
