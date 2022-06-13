import { shallow } from "enzyme";
import CloseButton from "../../../Components/Utils/CloseButton";
import { testProps } from "../../Test.utils";

describe("<CloseButton />", () => {
  test("Test component mount without error", () => {
    const wrapper = shallow(<CloseButton click={jest.fn()} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test props for the component", () => {
    testProps(CloseButton, { click: jest.fn(), type: "text" });
  });

  test("Test if onClick called properly", () => {
    const mock_onClick = jest.fn();
    const wrapper = shallow(<CloseButton click={mock_onClick} />);
    wrapper.simulate("click");
    expect(mock_onClick).toBeCalled();
  });

  test("Test if icon changes based on props", () => {
    let wrapper;

    wrapper = shallow(<CloseButton click={jest.fn()} type="contained" />);
    expect(wrapper.text()).toBe("cancel");

    wrapper = shallow(<CloseButton click={jest.fn()} type="text" />);
    expect(wrapper.text()).toBe("close");
  });
});
