import { mount } from "enzyme";
import React from "react";
import UploadControl from "../../../../../Components/Utils/Control/UploadControl";
import { testProps, findByAttr } from "../../../../Test.utils";

describe("<UploadControl />", () => {
  const setup = (props) => {
    const defaultProps = { name: "Upload Control Input" };
    return mount(<UploadControl {...defaultProps} {...props} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test component mount successfully", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test props of UploadControl component", () => {
    testProps(UploadControl, { name: "upload filed" });
  });

  test("Test input field id generated correctly", () => {
    const wrapper = setup({ name: "Upload Input Field" });
    const inputField = findByAttr(wrapper, "upload-input");
    expect(inputField.props().id).toBe("Upload_Input_Field-id");
  });

  test("Test components won't be visible, if hide props is set", () => {
    const wrapper = setup({
      hideButtons: true,
      hideDragNDrop: true,
      hideFileList: true,
    });

    const UploadButton = findByAttr(wrapper, "upload-button");
    expect(UploadButton.exists()).toBeFalsy();

    const DragnDrop = findByAttr(wrapper, "upload-drag-n-drop");
    expect(DragnDrop.exists()).toBeFalsy();

    const fileList = findByAttr(wrapper, "upload-file-list");
    expect(fileList.exists()).toBeFalsy();
  });

  test("Test rest props are set properly", () => {
    const rest = { "data-prop-a": "a", "data-prop-b": "b" };
    const wrapper = setup(rest);

    const inputField = findByAttr(wrapper, "upload-input");
    expect(inputField.props()).toEqual(expect.objectContaining(rest));
  });

  test("Test list is updated correctly on input change", async () => {
    const wrapper = setup();

    // Trigger input change
    const inputField = findByAttr(wrapper, "upload-input");
    await inputField.simulate("change", {
      target: { files: [{ name: "file 1" }, { name: "file 2" }] },
    });
    wrapper.update();

    // Test file list items tobe generated
    const fileListContainer = findByAttr(wrapper, "upload-file-list");
    expect(fileListContainer.props().listItems.length).toBe(2);
  });

  test("Test file is remove correctly, on remove btn clicked", async () => {
    const wrapper = setup();

    // Trigger input change
    const inputField = findByAttr(wrapper, "upload-input");
    await inputField.simulate("change", {
      target: { files: [{ name: "file 1" }, { name: "file 2" }] },
    });
    wrapper.update();

    // Trigger remove file function
    findByAttr(wrapper, "upload-file-item", 1).props().removeFile();
    wrapper.update();

    // Test second item does not exist
    const secondItem = findByAttr(wrapper, "upload-file-item", 1);
    expect(secondItem.exists()).toBeFalsy;
  });

  // TODO: Test onChange method
});
