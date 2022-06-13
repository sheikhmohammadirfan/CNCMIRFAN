import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { findByAttr } from "../Test.utils";

describe("<Breadcrumbs />", () => {
  const setup = (props, path) => {
    const defaultProps = {};
    return mount(
      <MemoryRouter initialEntries={[path || "/"]}>
        <Breadcrumbs {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  test("Test component generated properly", () => {
    const wrapper = setup({}, "/hello/world");
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test breadcrumbs chip generated properly", () => {
    const wrapper = setup({}, "/a/b/c/d");
    const chip = findByAttr(wrapper, "breadcrumbs-path-chip");

    // Test all chips are rendered
    expect(chip).toHaveLength(5);

    // Test chip, are render with correct text
    expect(chip.first().text()).toBe("Home");
    expect(chip.at(2).text()).toBe("b");

    // Test chips have correct path
    expect(chip.last().props().path).toBe("/a/b/c/d");
  });

  test("Test if last chip is non-clickable", () => {
    let wrapper, chip;

    // Test when no path there, home is not-clickable
    wrapper = setup();
    chip = findByAttr(wrapper, "breadcrumbs-path-chip");
    expect(chip.props().link).toBe(false);

    // Test when path is there, then last btn is not-clickable
    wrapper = setup({}, "/a/b/c");
    chip = findByAttr(wrapper, "breadcrumbs-path-chip");
    expect(chip.at(0).props().link).toBe(true);
    expect(chip.last().props().link).toBe(false);
  });
});
