import { shallow } from "enzyme";
import CustomAccordion from "../../../Components/Utils/CustomAccordion";
import { findByAttr, testProps } from "../../Test.utils";

describe("<CustomAccordion />", () => {
  const setup = (props) => {
    const defaultProps = {
      name: "accordion",
      summary: "Summary",
      details: "Details",
    };
    return shallow(<CustomAccordion {...defaultProps} {...props} />);
  };

  test("Test component render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test props of the components", () => {
    testProps(CustomAccordion, {
      name: "Test Accordion",
      expandIcon: "open",
      summary: "The Summury",
      summaryProps: { "data-summary": "true" },
      details: "DETAILS PART",
      detailProps: { "data-details": "true" },
    });
  });

  test("Test id generated correctly", () => {
    const wrapper = setup({ name: "Test Accordion" });
    const summary = findByAttr(wrapper, "accordion-summary");
    expect(summary.props().id).toBe("Test-Accordion-header");
    expect(summary.props()["aria-controls"]).toBe("Test-Accordion-content");
  });

  test("Test according generated correctly", () => {
    const props = {
      name: "Test Accordion",
      expandIcon: "open",
      summary: "The Summury",
      summaryProps: { "data-summary": "true" },
      details: "DETAILS PART",
      detailProps: { "data-details": "true" },
      "data-other": "true",
    };
    const wrapper = setup(props);

    // Test rest props are set properly
    const container = findByAttr(wrapper, "accordion-container");
    expect(container.props()["data-other"]).toBe("true");

    // Test summary icon & content & props are set properly
    const summary = findByAttr(wrapper, "accordion-summary");
    expect(summary.props().expandIcon).toBe("open");
    expect(summary.text()).toBe("The Summury");
    expect(summary.props()).toEqual(
      expect.objectContaining(props.summaryProps)
    );

    // Test details content & props are set properly
    const details = findByAttr(wrapper, "accordion-details");
    expect(details.text()).toBe("DETAILS PART");
    expect(details.props()).toEqual(expect.objectContaining(props.detailProps));
  });
});
