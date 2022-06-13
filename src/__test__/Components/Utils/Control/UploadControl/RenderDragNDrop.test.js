import { shallow } from "enzyme";
import { RenderDragNDrop } from "../../../../../Components/Utils/Control/UploadControl/RenderDragNDrop";
import { testProps, findByAttr } from "../../../../Test.utils";

describe("<RenderDragNDrop />", () => {
  const setup = (props) => {
    const defaultProps = {
      onChange: () => {},
      trigger: () => {},
      dialogOpen: true,
      closeDrag: jest.fn(),
    };
    const wrapper = shallow(<RenderDragNDrop {...defaultProps} {...props} />);
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
    testProps(RenderDragNDrop, {
      onChange: jest.fn(),
      trigger: jest.fn(),
      dialogOpen: true,
      closeDrag: jest.fn(),
    });
  });

  test("Test if container is passed, dialog-box won't mount", () => {
    const mock_container = jest.fn();
    const wrapper = setup({ container: mock_container });

    expect(mock_container).toBeCalled();

    const dragContainer = findByAttr(wrapper, "drag-n-drop-dialog-box");
    expect(dragContainer.exists()).toBeFalsy();
  });

  test("Test if content is passed, target template won't be shown", () => {
    const mock_content = jest.fn();
    const wrapper = setup({ content: mock_content });

    expect(mock_content).toBeCalled();

    const fileDrop = findByAttr(wrapper, "drag-n-drop-fileDrop");
    const dropTarget = findByAttr(fileDrop.dive(), "drag-n-drop-target");
    expect(dropTarget.exists()).toBeFalsy();
  });
});
