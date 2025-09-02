import { post } from "../CrudFactory";

export const getLibrary = async (payload, signal) => {
  return await post("/risk/scenarios/", payload, signal)
}