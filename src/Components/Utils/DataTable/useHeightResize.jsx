import { useCallback, useEffect, useRef, useState } from "react";

export default function useHeightResize(
  rowCount,
  draggerClass,
  minHeight,
  tableRef,
  rows
) {
  const getHeightList = (count, heightList = []) => {
    if (heightList.length === 0 && count > 0) {
      if (!Array.isArray(minHeight)) heightList = Array(count).fill(minHeight);
    }

    for (let i = 0; i < rowCount; i++)
      heightList[i] = {
        top: i === 0 ? 0 : heightList[i - 1].top + heightList[i - 1].height,
        height: Number(heightList[i]),
      };

    return heightList;
  };

  const draggerRef = useRef(null);

  // React hook to save the height of table
  const [tableWidth, setTableWidth] = useState("auto");

  const [activeIndex, setActiveIndex] = useState(null);

  const [colsHeight, setcolsHeight] = useState(getHeightList(rowCount));
  useEffect(() => {
    setcolsHeight(getHeightList(rowCount));
  }, [rows]);

  useEffect(() => {
    if (tableRef?.current) setTableWidth(tableRef.current.offsetWidth);
  }, [tableRef, rows]);

  const onMouseDown = (index) => setActiveIndex(index);

  const mouseMove = useCallback(
    (e) => {
      const gridRows = colsHeight.map((col, i) => {
        if (i === activeIndex) {
          let height =
            e.clientY -
            col.top -
            tableRef.current.parentNode.getBoundingClientRect().y;
          if (i > 0) height += tableRef?.current.parentNode.scrollTop;

          if (Array.isArray(minHeight))
            return `${
              height >= minHeight[i - 1] ? height : minHeight[i - 1]
            }px`;
          else return `${height >= minHeight ? height : minHeight}px`;
        }

        return `${col.height}px`;
      });
      // Assign the px values to the table
      tableRef.current.style.gridTemplateRows = `${gridRows.join(" ")}`;
    },
    [activeIndex, colsHeight, minHeight]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
    setcolsHeight(() => {
      let template = tableRef?.current.style.gridTemplateRows;
      template = template.slice(0, template.length - 2).split("px ");
      return getHeightList(template.length, template);
    });
  }, [setActiveIndex, setcolsHeight, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => removeListeners;
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  return ({ index }) => (
    <div
      ref={draggerRef}
      style={{ width: tableWidth }}
      className={draggerClass + " " + (activeIndex === index ? "active" : " ")}
      onMouseDown={(i) => onMouseDown(index)}
    />
  );
}
