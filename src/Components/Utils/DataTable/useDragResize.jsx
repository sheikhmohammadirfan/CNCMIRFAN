import { useState, useEffect, useRef, useCallback } from "react";

export default function useDragResize(
  colCount,
  draggerClass,
  minWidth,
  minCheckWidth,
  header
) {
  // Method to generate list of dictionary to save left & width of each col
  const getWidthList = (count, widthList = []) => {
    // if no list of width is passed, then create empty list with only minWidth
    if (widthList.length === 0 && count > 0) {
      if (Array.isArray(minWidth)) widthList = [minCheckWidth, ...minWidth];
      else widthList = [minCheckWidth, ...Array(count - 1).fill(minWidth)];
    }

    // Populate left & width value of list
    for (let i = 0; i < colCount; i++)
      widthList[i] = {
        left: i === 0 ? 0 : widthList[i - 1].left + widthList[i - 1].width,
        width: Number(widthList[i]),
      };

    return widthList;
  };

  // React hook to save reference of table
  const tableRef = useRef(null);

  const draggerRef = useRef(null);

  // React hook to save the height of table
  const [tableHeight, setTableHeight] = useState("auto");

  // React hook to get index of currently selected columns
  const [activeIndex, setActiveIndex] = useState(null);

  // React hook to store left & width of each col as list of dictionary
  const [colsWidth, setcolsWidth] = useState(getWidthList(colCount));
  useEffect(() => {
    setcolsWidth(getWidthList(colCount));
  }, [header]);

  // Update table height state on mounting component
  useEffect(() => {
    if (tableRef.current) setTableHeight(tableRef.current.offsetHeight);
  }, [tableRef, header]);

  // Change active index on clicking on dragger
  const onMouseDown = (index) => setActiveIndex(index);

  // Update active col width on dragging after clicking
  const mouseMove = useCallback(
    (e) => {
      const gridColumns = colsWidth.map((col, i) => {
        if (i === activeIndex) {
          // Calculate the column width
          let width =
            e.clientX -
            col.left -
            tableRef.current.parentNode.getBoundingClientRect().x;
          if (i > 1) width += tableRef.current.parentNode.scrollLeft;

          if (i === 0)
            return `${width >= minCheckWidth ? width : minCheckWidth}px`;
          else if (Array.isArray(minWidth))
            return `${width >= minWidth[i - 1] ? width : minWidth[i - 1]}px`;
          else return `${width >= minWidth ? width : minWidth}px`;
        }

        // Otherwise return the previous width (no changes)
        return `${col.width}px`;
      });

      // Assign the px values to the table
      tableRef.current.style.gridTemplateColumns = `${gridColumns.join(" ")}`;
    },
    [activeIndex, colsWidth, minWidth]
  );

  // Remove event listener attached on window
  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  // Update state on releasing mouse after dragging
  const mouseUp = useCallback(() => {
    // Reset active index
    setActiveIndex(null);
    // Remove listeners
    removeListeners();
    // Update state
    setcolsWidth(() => {
      let template = tableRef.current.style.gridTemplateColumns;
      template = template.slice(0, template.length - 2).split("px ");
      return getWidthList(template.length, template);
    });
  }, [setActiveIndex, setcolsWidth, removeListeners]);

  // Attach event listeners, if any col is active & remove listeners on unmount
  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => removeListeners;
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  // UI component to show Vertical resizer
  const VerticalResizer = ({ index }) => (
    <div
      ref={draggerRef}
      style={{ height: tableHeight }}
      className={draggerClass + " " + (activeIndex === index ? "active" : " ")}
      onMouseDown={(i) => onMouseDown(index)}
    />
  );

  return { tableRef, VerticalResizer };
}
