import { checkPropTypes } from "prop-types";

export const testProps = (Component, props) => {
  const errorConsole = jest.spyOn(console, "error");
  const propsError = checkPropTypes(
    Component.propTypes,
    props,
    "prop",
    Component?.render?.displayName
  );
  expect(errorConsole).not.toBeCalled();
};

export const findByAttr = (wrapper, attr, index = -1) => {
  if (index > -1) return wrapper.find(`[data-test='${attr}']`).at(index);
  else return wrapper.find(`[data-test='${attr}']`);
};

export const getHook = (wrapper) => wrapper.find("div").props().hook;
