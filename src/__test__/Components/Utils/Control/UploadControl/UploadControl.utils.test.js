import {
  fileObj1,
  fileObj2,
} from "../../../../../assets/data/__test__/mockObj";
import {
  addFiles,
  isFileExist,
} from "../../../../../Components/Utils/Control/UploadControl/UploadControl.utils";

describe("isFileExist()", () => {
  test("Test for already existing file", () => {
    expect(isFileExist(fileObj1, fileObj2[0])).toBe(true);
  });

  test("Test for new file", () => {
    expect(isFileExist(fileObj1, fileObj2[3])).toBe(false);
  });
});

describe("addFiles()", () => {
  const mock_changeInput = jest.fn();
  const mock_changeState = jest.fn();

  test("Test is multiple props is false, then changeInput is called", () => {
    addFiles(false, fileObj1, mock_changeInput, mock_changeState);
    expect(mock_changeInput).toBeCalledWith(fileObj1[0]);
  });

  test("Test is multiple props is set, then changeState is called", () => {
    addFiles(true, fileObj1, mock_changeInput, mock_changeState);
    expect(mock_changeState).toBeCalled();
  });
});
