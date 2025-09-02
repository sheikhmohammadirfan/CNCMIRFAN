export default function useCheck(checkList, setCheckLst, length) {
  // Check a checkbox at given index
  const checkAtIndex = (index) => setCheckLst((val) => [...val, index]);

  // Uncheck a checkbox at given index
  const uncheckAtIndex = (index) =>
    setCheckLst((val) => val.filter((v) => v !== index));

  // Check All checkboxes
  const checkAll = () => setCheckLst(Array.from({ length }, (v, k) => k));

  // uncheck All checkboxes
  const uncheckAll = () => setCheckLst([]);

  // Method to check if a index is checked or not
  const isCheckedAtIndex = (index) => checkList.includes(index);

  // Check if all checkbox is selected
  const isAllChecked = () => checkList.length === length && length > 0;

  // Check if some checkbox is selected
  const isSomeChecked = () => checkList.length > 0 && checkList.length < length;

  return {
    checkAtIndex,
    uncheckAtIndex,
    checkAll,
    uncheckAll,
    isCheckedAtIndex,
    isAllChecked,
    isSomeChecked,
  };
}
