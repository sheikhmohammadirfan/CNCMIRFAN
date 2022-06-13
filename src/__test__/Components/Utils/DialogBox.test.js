import { shallow } from "enzyme";
import DialogBox from "../../../Components/Utils/DialogBox";
import { findByAttr, testProps } from "../../Test.utils";

describe("<DialogBox />", () => {
  const setup = (props) => {
    const defaultProps = { open: true, close: jest.fn() };
    return shallow(<DialogBox {...defaultProps} {...props} />);
  };

  test("Component render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test component props", () => {
    testProps(DialogBox, {
      open: true,
      close: jest.fn(),
      loading: false,
      title: "Dialog Title",
      titleProp: { component: "span" },
      content: "Hello",
      contentProp: { testAlign: "center" },
      actions: [<button>a</button>, <button>b</button>],
      actionProp: { fontSize: "large" },
      bottomSeperator: true,
    });
  });

  test("Test title is rendered properly", () => {
    const props = { titleProp: { textAlign: "center" }, title: "Box Title" };
    const wrapper = setup(props);
    const title = findByAttr(wrapper, "dialogbox-title");

    expect(title.props()).toEqual(expect.objectContaining(props.titleProp));
    expect(title.text()).toBe(props.title);
  });

  test("Test loader visibility toggle works correctly", () => {
    let wrapper, loader, divider;

    // When loading is false, the loader is hidden & seperator is visible
    wrapper = setup({ loading: false });
    loader = findByAttr(wrapper, "dialogbox-loader");
    divider = findByAttr(wrapper, "dialogbox-divider");
    expect(loader.exists()).toBeFalsy();
    expect(divider.exists()).toBeTruthy();

    // When loading is true, the separator is hidden & loader is visible
    wrapper = setup({ loading: true });
    loader = findByAttr(wrapper, "dialogbox-loader");
    divider = findByAttr(wrapper, "dialogbox-divider");
    expect(loader.exists()).toBeTruthy();
    expect(divider.exists()).toBeFalsy();
  });

  test("Test content is rendered properly", () => {
    const props = { contentProp: { textAlign: "center" }, content: "Content" };
    const wrapper = setup(props);
    const content = findByAttr(wrapper, "dialogbox-content");

    expect(content.props()).toEqual(expect.objectContaining(props.contentProp));
    expect(content.text()).toBe(props.content);
  });

  test("Test bottomSeperator is shown properly", () => {
    let wrapper, seperator;

    // When bottomSeperator is false
    wrapper = setup({ bottomSeperator: false, actions: ["a"] });
    seperator = findByAttr(wrapper, "dialogbox-bottom-divider");
    expect(seperator.exists()).toBeFalsy();

    // When bottomSeperator is true
    wrapper = setup({ bottomSeperator: true, actions: ["a"] });
    seperator = findByAttr(wrapper, "dialogbox-bottom-divider");
    expect(seperator.exists()).toBeTruthy();
  });

  test("Test actions button generated properly", () => {
    const wrapper = setup({
      actions: [
        <button>a</button>,
        <button>b</button>,
        { element: "a", prop: {} },
      ],
    });
    const actions = findByAttr(wrapper, "dialogbox-actions-btn");
    expect(actions).toHaveLength(3);
  });
});
