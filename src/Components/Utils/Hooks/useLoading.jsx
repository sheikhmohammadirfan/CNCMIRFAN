import { useCallback } from "react";
import { useState } from "react";

// Method to set all key in obj to a state
const setAll = (obj, state) => {
  const keys = Object.keys(obj);
  const newVal = {};
  for (let key of keys) newVal[key] = state;
  return newVal;
};

// Method to set keys to given state
const setFew = (prev, newKeys, state) => {
  const newVal = {};
  for (let key of newKeys) newVal[key] = state;
  return { ...prev, ...newVal };
};

// Check loading status
const checkLoading = (keys, loading) =>
  keys.length > 0
    ? keys.find((key) => loading[key])
    : Object.keys(loading).find((key) => loading[key]);

export default function useLoading(initial) {
  // state to save loading status
  const isUndefiend = () => initial === undefined;
  const [loading, setLoading] = useState(isUndefiend() ? false : initial);

  // Method to start loading for any parameter passed, elsed set all
  const startLoading = (...newVal) =>
    setLoading((prevVal) =>
      newVal.length > 0
        ? setFew(prevVal, newVal, true)
        : isUndefiend()
        ? true
        : setAll(initial, true)
    );

  // Method to stop loading for any parameter passed, elsed unset all
  const stopLoading = (...newVal) =>
    setLoading((prevVal) =>
      newVal.length > 0
        ? setFew(prevVal, newVal, false)
        : isUndefiend()
        ? false
        : setAll(initial, false)
    );

  // Method to set & unset loading value based on given status
  const updateLoading = (newVal) =>
    setLoading((prevVal) => ({ ...prevVal, ...newVal }));

  // Method to check if any state is loading, or any of all state is loading if no parameter is passed.
  const isLoading = useCallback(
    (...keys) => (isUndefiend() ? loading : checkLoading(keys, loading)),
    [loading]
  );

  return {
    isLoading,
    setLoading,
    updateLoading,
    startLoading,
    stopLoading,
  };
}
