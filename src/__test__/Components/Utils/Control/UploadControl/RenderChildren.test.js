import { shallow } from "enzyme";
import { RenderChildren } from "../../../../../Components/Utils/Control/UploadControl/RenderChildren";
import { testProps, findByAttr } from "../../../../Test.utils";

describe("<RenderChildren />", () => {
  const setup = (props) => {
    const defaultProps = { fileList: [] };
    const wrapper = shallow(<RenderChildren {...defaultProps} {...props} />);
    return wrapper.debug() ? wrapper.dive() : wrapper;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test component mount successfully", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test props of component", () => {
    testProps(RenderChildren, { fileList: [] });
  });

  test("Test drag btn won't be visible, if hideDragNDrop is set", () => {
    const wrapper = setup({ hideDragNDrop: true });
    const dragBtn = findByAttr(wrapper, "render-children-dragBtn");
    expect(dragBtn.exists()).toBeFalsy();
  });

  test("Test remove btn won't be visible, if fileList length is 0", () => {
    const wrapper = setup({ fileList: [] });
    const removeBtn = findByAttr(wrapper, "render-children-removeBtn");
    expect(removeBtn.exists()).toBeFalsy();
  });

  test("Test if children is passed, sub-component won't mount", () => {
    const mock_children = jest.fn();
    const mock_trigger = jest.fn();
    const mock_removeAll = jest.fn();
    const mock_openDrag = jest.fn();
    const wrapper = setup({
      children: mock_children,
      trigger: mock_trigger,
      removeAll: mock_removeAll,
      openDrag: mock_openDrag,
    });

    // Children is called with props functions
    expect(mock_children).toBeCalledWith(
      mock_trigger,
      mock_removeAll,
      mock_openDrag
    );

    // Drag btn won't mount
    const dragBtn = findByAttr(wrapper, "render-children-uploadBtn");
    expect(dragBtn.exists()).toBeFalsy();
  });

  test("Test methods are being called, on button click", () => {
    const mock_trigger = jest.fn();
    const mock_removeAll = jest.fn();
    const mock_openDrag = jest.fn();
    const wrapper = setup({
      fileList: [1],
      trigger: mock_trigger,
      removeAll: mock_removeAll,
      openDrag: mock_openDrag,
    });

    const uploadBtn = findByAttr(wrapper, "render-children-uploadBtn");
    uploadBtn.simulate("click");
    expect(mock_trigger).toBeCalled();

    const dragBtn = findByAttr(wrapper, "render-children-dragBtn");
    dragBtn.simulate("click");
    expect(mock_openDrag).toBeCalled();

    const deleteBtn = findByAttr(wrapper, "render-children-removeBtn");
    deleteBtn.simulate("click");
    expect(mock_removeAll).toBeCalled();
  });
});
