import { mount } from "enzyme";
import SidebarItem from "../../../Components/Sidebar/SidebarItem";
import { findByAttr } from "../../Test.utils";

describe("<SidebarItem />", () => {
  const setup = (props) => {
    const defaultProps = { text: <span>SidebarItem</span>, icon: "icons" };
    return mount(<SidebarItem {...defaultProps} {...props} />);
  };

  test("Test component render properly", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test component without sub-menu", () => {
    const wrapper = setup({ text: <span>Item 1</span>, icon: "icon" });

    const icon = findByAttr(wrapper, "sidebaritem-without-icon");
    const text = findByAttr(wrapper, "sidebaritem-without-text");

    expect(icon.exists()).toBeTruthy();
    expect(text.exists()).toBeTruthy();
  });

  test("Test component with sub-menu", () => {
    const wrapper = setup({
      text: <span>Item 1</span>,
      icon: "icon",
      subMenu: [
        { title: "Email", icon: "email" },
        { title: "MY TASKS", to: "/events", icon: "star" },
        { title: "MY TASKS", to: "/events", icon: "star" },
        { title: "MY TASKS", to: "/events", icon: "star" },
      ],
    });

    const icon = findByAttr(wrapper, "sidebaritem-with-icon");
    const text = findByAttr(wrapper, "sidebaritem-with-text");

    expect(icon.exists()).toBeTruthy();
    expect(text.exists()).toBeTruthy();
  });
});
