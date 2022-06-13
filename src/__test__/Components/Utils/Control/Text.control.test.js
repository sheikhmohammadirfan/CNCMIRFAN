import { shallow } from "enzyme";
import TextControl from "../../../../Components/Utils/Control/Text.control";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<TextControl />", () => {
  const setup = (props) => {
    const defaultProps = {};
    return shallow(<TextControl {...defaultProps} {...props} />)
      .dive()
      .dive();
  };

  test("Text field shown without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Text field props work without error", () => {
    testProps(TextControl, { name: "name", controls: {} });
  });

  test("Test value changes without error", () => {
    const mock_onChange = jest.fn();

    // Trigger change event
    const wrapper = setup({ onChange: mock_onChange });
    wrapper.simulate("change");

    expect(mock_onChange).toBeCalled();
  });
});
