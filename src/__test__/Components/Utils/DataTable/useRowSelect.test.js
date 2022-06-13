import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import useRowSelect from "../../../../Components/Utils/DataTable/useRowSelect";
import { getHook } from "../../../Test.utils";

describe("DataTable -- useRowSelect()", () => {
  const setup = (props) => {
    const Wrapper = () => {
      const hook = useRowSelect(...props);
      return <div hook={hook} />;
    };
    return mount(<Wrapper />);
  };

  const defaultProps = {
    rowData: Array(7),
    pageSize: 3,
    selectedRows: [],
    setSelectedRows: jest.fn(),
  };

  test("Test hook execute without error", () => {
    let hook;

    try {
      hook = getHook(setup(Object.values(defaultProps)));
    } catch (e) {}

    expect(hook).toEqual(
      expect.objectContaining({
        sliceRowLength: expect.any(Function),
        page: expect.any(Number),
        updatePage: expect.any(Function),
        rowsPerPage: expect.any(Number),
        startIndex: expect.any(Number),
        toggleRow: expect.any(Function),
        toggleAllRows: expect.any(Function),
        isChecked: expect.any(Function),
        isSomeChecked: expect.any(Function),
        isAllChecked: expect.any(Function),
      })
    );
  });

  test("Test when updatePage is called, then startIndex is changed & selectedRows is emptied", () => {
    // Get hooks
    const wrapper = setup(Object.values(defaultProps));
    const hook = () => getHook(wrapper);

    // Trigger update
    act(() => hook().updatePage("", 1));
    wrapper.update();

    // Test
    expect(hook().startIndex).toBe(3);
    expect(defaultProps.setSelectedRows).toBeCalledWith([]);
  });

  test("Test rows per page is pageSize if passed, else is row length", () => {
    let hook;

    // If pageSize is passed
    hook = () => getHook(setup(Object.values(defaultProps)));
    expect(hook().rowsPerPage).toBe(3);

    // If pageSize is not passed
    hook = () =>
      getHook(setup(Object.values({ ...defaultProps, pageSize: undefined })));
    expect(hook().rowsPerPage).toBe(defaultProps.rowData.length);
  });

  test("Test when toggleRow is called, then setSelectedRows is called", () => {
    // Get hooks
    const wrapper = setup(Object.values(defaultProps));
    const hook = () => getHook(wrapper);

    // Trigger update
    hook().toggleRow(1, true);
    wrapper.update();

    // Test
    expect(defaultProps.setSelectedRows).toBeCalled();
  });

  test("Test when toggleAllRows is called, then setSelectedRows either emptied or filled with index", () => {
    // Get hooks
    const wrapper = setup(Object.values(defaultProps));
    const hook = () => getHook(wrapper);

    // Trigger update
    hook().toggleAllRows(true);
    wrapper.update();
    expect(defaultProps.setSelectedRows).toBeCalledWith([0, 1, 2]);

    // Trigger update
    hook().toggleAllRows(false);
    wrapper.update();
    expect(defaultProps.setSelectedRows).toBeCalledWith([]);
  });

  test("Test isChecked method works correctly", () => {
    const hook = getHook(
      setup(Object.values({ ...defaultProps, selectedRows: [0, 1] }))
    );
    expect(hook.isChecked(0)).toBe(true);
    expect(hook.isChecked(2)).toBe(false);
  });

  test("Test isSomeChecked method works correctly", () => {
    let hook;

    // Test with no row index in it
    hook = getHook(setup(Object.values(defaultProps)));
    expect(hook.isSomeChecked()).toBe(false);

    // Test with some index of checked row in it
    hook = getHook(
      setup(Object.values({ ...defaultProps, selectedRows: [0, 1] }))
    );
    expect(hook.isSomeChecked()).toBe(true);
  });

  test("Test isAllChecked method works correctly", () => {
    let hook;

    // Test with some index of checked row in it
    hook = getHook(
      setup(Object.values({ ...defaultProps, selectedRows: [0, 1] }))
    );
    expect(hook.isAllChecked()).toBe(false);

    // Test with all checked row index in it
    hook = getHook(
      setup(Object.values({ ...defaultProps, selectedRows: [0, 1, 2] }))
    );
    expect(hook.isAllChecked()).toBe(true);
  });
});
