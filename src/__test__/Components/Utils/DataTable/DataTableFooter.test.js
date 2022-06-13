import { shallow } from "enzyme";
import DataTableFooter from "../../../../Components/Utils/DataTable/DataTableFooter";
import { testProps, findByAttr } from "../../../Test.utils";

describe("<DataTableFooter />", () => {
  const setup = (props) => {
    const defaultProps = {
      pageSize: 10,
      rowsPerPage: 10,
      page: 2,
      onPageChange: jest.fn(),
      count: 100,
    };
    return shallow(<DataTableFooter {...defaultProps} {...props} />);
  };

  test("Test component render without error", () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test("Test components props", () => {
    testProps(DataTableFooter, {
      component: <span>hi</span>,
      pageSize: 10,
      rowsPerPage: 10,
      page: 2,
      onPageChange: jest.fn(),
      count: 100,
    });
  });

  test("Test passed component generated correctly", () => {
    const Component = () => <span>hello</span>;
    const wrapper = setup({
      component: <Component data-test="footer-props-component" />,
    });
    const propsComponent = findByAttr(wrapper, "footer-props-component");
    expect(propsComponent.exists()).toBeTruthy();
  });

  test("Test if pageSize is 0, then pagination component is not generated", () => {
    const wrapper = setup({ pageSize: 0 });
    const paginationComponent = findByAttr(wrapper, "footer-pagination");
    expect(paginationComponent.exists()).toBeFalsy();
  });

  test("Test props are passed correctly to TablePagination component", () => {
    const props = {
      rowsPerPage: 10,
      page: 2,
      onPageChange: jest.fn(),
      count: 100,
    };
    const wrapper = setup(props);
    const paginationComponent = findByAttr(wrapper, "footer-pagination");
    expect(paginationComponent.props()).toEqual(expect.objectContaining(props));
  });
});
