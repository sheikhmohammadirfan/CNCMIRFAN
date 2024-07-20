const FILTER_HANDLERS = {
  register: (currentFilters, checkedId) => {
    // If id is already in filter, remove it, else add the id
    return currentFilters.includes(checkedId)
    ? []
    : [checkedId];
  },
}

export default FILTER_HANDLERS;