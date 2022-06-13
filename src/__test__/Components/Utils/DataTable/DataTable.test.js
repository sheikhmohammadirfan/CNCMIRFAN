import { shallow } from "enzyme";
import {
  dataTableHeader,
  dataTableRow,
} from "../../../../assets/data/__test__/mockObj";
import DataTable from "../../../../Components/Utils/DataTable/DataTable";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<DataTable />", () => {
  const setup = (props) => {
    const defaultProps = {
      header: dataTableHeader,
      rowList: dataTableRow,
    };
    return shallow(<DataTable {...defaultProps} {...props} />);
  };

  test("Test component render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test component props", () => {
    testProps(DataTable, {
      checkbox: true,
      selectedRows: [],
      setSelectedRows: jest.fn(),
      pageSize: 3,
      checkbox: false,
      serialNo: false,
      stickyHeader: false,
      footerComponent: "footer",
      verticalBorder: false,
      resizeTable: false,
      header: {
        data: [
          { text: "A", css: { color: "red" } },
          { text: "B", css: { color: "blue" } },
        ],
        props: { "data-header": "true" },
      },
      rowList: {
        rowData: [
          {
            data: [
              { text: "A", css: { color: "red" } },
              { text: "B", css: { color: "blue" } },
            ],
            props: { cell: "1" },
          },
        ],
        cellProps: { padding: 3 },
      },
      headerWrapper: (data) => `HEADER-${data}`,
      rowWrapper: (data) => `ROW-${data}`,
      minCellWidth: [10, 20],
      minCheckboxWidth: 10,
      className: "class-table",
    });
  });

  test("Test rows & columns are generated properly", () => {
    let wrapper = setup({ checkbox: true });

    let headerCell = findByAttr(wrapper, "datatable-header-cell");
    expect(headerCell).toHaveLength(dataTableHeader.data.length + 2);

    let headerSerialno = findByAttr(wrapper, "datatable-header-serialNo");
    expect(headerSerialno.exists()).toBeTruthy();

    let headerCheckbox = findByAttr(wrapper, "datatable-header-checkbox");
    expect(headerCheckbox.exists()).toBeTruthy();

    let rowCell = findByAttr(wrapper, "datatable-row-cell");
    expect(rowCell).toHaveLength(dataTableRow.rowData.length * 6);

    let rowSerialno = findByAttr(wrapper, "datatable-row-serialNo");
    expect(rowSerialno).toHaveLength(dataTableRow.rowData.length);

    let rowCheckbox = findByAttr(wrapper, "datatable-row-checkbox");
    expect(rowCheckbox).toHaveLength(dataTableRow.rowData.length);

    wrapper = setup({ checkbox: false, serialNo: false });

    headerSerialno = findByAttr(wrapper, "datatable-header-serialNo");
    expect(headerSerialno.exists()).toBeFalsy();

    headerCheckbox = findByAttr(wrapper, "datatable-header-checkbox");
    expect(headerCheckbox.exists()).toBeFalsy();

    rowSerialno = findByAttr(wrapper, "datatable-row-serialNo");
    expect(rowSerialno.exists()).toBeFalsy();

    rowCheckbox = findByAttr(wrapper, "datatable-row-checkbox");
    expect(rowCheckbox.exists()).toBeFalsy();
  });

  test("Test row count changes, based on pageSize props", () => {
    let wrapper;
    let rows;

    // If pageSize is passed
    wrapper = setup({ pageSize: 3, rowList: dataTableRow });
    rows = findByAttr(wrapper, "datatable-row-container");
    expect(rows).toHaveLength(3);

    // If pageSize is not passed
    wrapper = setup({ rowList: dataTableRow });
    rows = findByAttr(wrapper, "datatable-row-container");
    expect(rows).toHaveLength(dataTableRow.rowData.length);
  });

  test("Test class are passed to header, if stickyHeader is set", () => {
    const wrapper = setup({ stickyHeader: true });
    const header = findByAttr(wrapper, "datatable-header-container");
    expect(header.hasClass("sticky")).toBeTruthy();
  });

  test("Test if column resizer is add, when resizeTable is passed", () => {
    const wrapper = setup({ resizeTable: true });
    const dragger = findByAttr(wrapper, "column-resizer");
    expect(dragger.exists()).toBeTruthy();
  });

  test("Test if minCellWidth, generate gridtable correctly", () => {
    let wrapper;
    let table;

    wrapper = setup({
      serialNo: false,
      resizeTable: true,
      minCellWidth: 100,
    });
    table = findByAttr(wrapper, "datatable-table");
    expect(table.props().style.gridTemplateColumns).toBe(
      "100px 100px 100px 100px"
    );

    wrapper = setup({
      serialNo: false,
      resizeTable: true,
      minCellWidth: [100, 40, 20, 30],
    });
    table = findByAttr(wrapper, "datatable-table");
    expect(table.props().style.gridTemplateColumns).toBe(
      "100px 40px 20px 30px"
    );
  });
});
