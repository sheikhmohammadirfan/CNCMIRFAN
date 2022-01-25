import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
export function useParams() {
  const location = useLocation();
  const history = useHistory();
  //   useEffect(() => {
  //     const urlSearchParams = new URLSearchParams(location.search);
  //     const params = Object.fromEntries(urlSearchParams.entries());
  //   }, [location]);

  const getParams = () => {
    const urlSearchParams = new URLSearchParams(location.search);
    return Object.fromEntries(urlSearchParams.entries());
  };

  const deleteParams = (key) => {
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.delete(key);
    history.replace({
      search: urlSearchParams.toString(),
    });
  };

  return { getParams, deleteParams, location };
}
