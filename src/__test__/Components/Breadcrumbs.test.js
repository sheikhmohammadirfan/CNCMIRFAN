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
    const wrapper = setup({}, "/poam/verify/Integrated-Platforms/profile");
    const chip = findByAttr(wrapper, "breadcrumbs-path-chip");

    // Test all chips are rendered
    expect(chip).toHaveLength(4);

    // Test chip, are render with correct text
    expect(chip.at(2).text()).toBe("Integrated Platforms");

    // Test chips have correct path
    expect(chip.last().props().path).toBe(
      "/poam/verify/Integrated-Platforms/profile"
    );
  });

  test("Test if last chip is non-clickable", () => {
    let wrapper, chip;

    // Test when path is there, then last btn is not-clickable
    wrapper = setup({}, "/poam/verify/Integrated-Platforms");
    chip = findByAttr(wrapper, "breadcrumbs-path-chip");
    expect(chip.at(0).props().link).toBe(true);
    expect(chip.last().props().link).toBe(false);
  });
});
