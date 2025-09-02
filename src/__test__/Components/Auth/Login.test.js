import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../Components/Auth/Login";
import { findByAttr, testProps } from "../../Test.utils";
import React from "react";

jest.mock("../../../Service/UserFactory");

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

  test("component props passed correctly", () => {
    testProps(Login, { title: "Login", homePage: jest.fn() });
  });
});
