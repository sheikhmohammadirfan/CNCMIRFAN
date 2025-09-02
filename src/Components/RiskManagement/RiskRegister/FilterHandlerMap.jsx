const FILTER_HANDLERS = {
  treatment: (currentFilters, checkedId) => {
    if (checkedId === 0) {
      return (currentFilters.includes(checkedId)) ? [] : [checkedId];
    } else {
      return (currentFilters.includes(checkedId))
        ? currentFilters.filter((id) => id !== checkedId)
        : [...currentFilters, checkedId].filter(id => id !== 0);
    }
  },
  ciaCategories: (currentFilters, checkedId) => {
    if (checkedId === 1) {
      return (currentFilters.includes(checkedId)) ? [] : [checkedId];
    } else {
      return (currentFilters.includes(checkedId))
        ? currentFilters.filter((id) => id !== checkedId)
        : [...currentFilters, checkedId].filter(id => id !== 1);
    }
  },
  identified: (currentFilters, checkedId) => {
    return (currentFilters.includes(checkedId))
      ? []
      : [checkedId];
  }
}

export default FILTER_HANDLERS;