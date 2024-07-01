import { post } from "../CrudFactory";

export const getLibrary = async (payload) => {
  return await post("/risk/scenarios/", payload)
}