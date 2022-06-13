import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../Components/Auth/Login";
import { findByAttr, testProps } from "../../Test.utils";
import axios from "axios";
jest.mock("axios");

describe("<Login />", () => {
  const setup = (props) => {
    const defaultProps = { title: "Login", homePage: jest.fn() };
    return mount(
      <MemoryRouter>
        <Login {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Component renders properly, without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test component props passed correctly", () => {
    testProps(Login, { title: "Login", homePage: jest.fn() });
  });

  test("", () => {
    // axios.mockImplementation(() => Promise.resolve({ data: "hi" }));
    const wrapper = setup();
    // const emailField = findByAttr(wrapper, "login-email-field", 0);
    // emailField.simulate("change", { target: "1Abcd@gmail.com" });
    // const passField = findByAttr(wrapper, "login-password-field", 0);
    // passField.simulate("change", { target: "1Abcd@gmail.com" });
    const submitBtn = findByAttr(wrapper, "login-submit-btn").last();
    submitBtn.simulate("click");
    wrapper.setProps();
    console.log(wrapper.debug());
    expect(axios).toBeCalled();
  });
});
