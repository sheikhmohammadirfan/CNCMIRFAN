import { createTheme, ThemeProvider } from "@material-ui/core";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { findByAttr } from "../../Test.utils";

describe("<Sidebar />", () => {
  const setup = (props) => {
    const defaultProps = { isOpen: true, toggleSidebar: jest.fn() };
    return mount(
      <ThemeProvider theme={createTheme()}>
        <BrowserRouter>
          <Sidebar {...defaultProps} {...props} />
        </BrowserRouter>
      </ThemeProvider>
    );
  };

  test("Components render without order", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test sidebar open/close based on props", () => {
    let wrapper, container;

    // Test if close class is not applied
    wrapper = setup({ isOpen: true });
    container = findByAttr(wrapper, "sidebar-container").first();
    expect(container.hasClass("close")).toBeFalsy();

    // Test if close class is applied
    wrapper = setup({ isOpen: false });
    container = findByAttr(wrapper, "sidebar-container").first();
    expect(container.hasClass("close")).toBeTruthy();
  });

  test("Test toggleSidebar works properly", () => {
    const mock_toggleSidebar = jest.fn();
    const wrapper = setup({ toggleSidebar: mock_toggleSidebar });

    const toggleBtn = findByAttr(wrapper, "sidebar-toggler").first();
    toggleBtn.simulate("click");

    expect(mock_toggleSidebar).toBeCalled();
  });

  test("Test component mount successfully", () => {
    const wrapper = setup();

    const profile = findByAttr(wrapper, "sidebar-profile");
    expect(profile.exists()).toBeTruthy();

    const logout = findByAttr(wrapper, "sidebar-logout");
    expect(logout.exists()).toBeTruthy();
  });
});
