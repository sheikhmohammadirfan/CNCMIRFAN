import { shallow } from "enzyme";
import { RenderListItem } from "../../../../../Components/Utils/Control/UploadControl/RenderListItem";
import { testProps, findByAttr } from "../../../../Test.utils";

describe("<RenderListItem />", () => {
  const setup = (props) => {
    const defaultProps = {};
    const wrapper = shallow(<RenderListItem {...defaultProps} {...props} />);
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
    testProps(RenderListItem, {
      listItem: jest.fn(),
      fileName: "hello.py",
      index: 0,
      removeFile: jest.fn(),
    });
  });

  test("Test if listItem is passed, Container won't mount", () => {
    const mock_listItem = jest.fn();
    const fileName = "file_name";
    const index = 0;
    const mock_removeFile = jest.fn();
    const wrapper = setup({
      listItem: mock_listItem,
      fileName,
      index,
      removeFile: mock_removeFile,
    });

    expect(mock_listItem).toBeCalledWith(fileName, index, mock_removeFile);

    const container = findByAttr(wrapper, "listitem-container");
    expect(container.exists()).toBeFalsy();
  });

  test("Test if item is removed, on button click", () => {
    const mock_removeFile = jest.fn();
    const wrapper = setup({ removeFile: mock_removeFile });

    const removeBtn = findByAttr(wrapper, "listitem-remove-btn");
    removeBtn.simulate("click");

    expect(mock_removeFile).toBeCalled();
  });
});
