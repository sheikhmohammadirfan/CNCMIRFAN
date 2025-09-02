import { useState, useEffect, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { changeQueryParams, deleteQueryParams } from "../Utils";

export default function useParams(...watch) {
  // UseLocation to trigger queryparams change
  const location = useLocation();
  // UseHistory to change params
  const history = useHistory();
  // UseState to save state of watchin/all queryparams
  const [params, setParams] = useState({});

  // Update all/watching params on route change
  useEffect(() => {
    // get query params
    const queryParams = getParams();

    // if no parameter is passes, then watch all
    if (watch.length === 0) setParams(queryParams);

    // Loop through query params, and save only changed value
    const newVal = { ...params };
    let valueChanged = false;
    for (let query of watch)
      if (newVal[query] !== queryParams[query]) {
        valueChanged = true;
        if (queryParams[query] === undefined) delete newVal[query];
        else newVal[query] = queryParams[query];
      }

    // if value changed, then update state
    if (valueChanged) setParams(newVal);
  }, [location]);

  /* Method to extract queryparams object from location route string */
  const getParams = useCallback(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    return Object.fromEntries(urlSearchParams.entries());
  }, [location]);

  /* Change queryparams either replacing or removing */
  const changeParams = (param, removeAll) =>
    history.replace(`?${changeQueryParams(param, removeAll)}`);

  /* Method to remove mentioned params */
  const deleteParams = (...paramList) =>
    history.replace(`?${deleteQueryParams(...paramList)}`);

  return { params, changeParams, getParams, deleteParams, location };
}
