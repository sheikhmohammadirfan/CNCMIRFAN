import { post } from "../CrudFactory";

export async function getActions(options, signal) {
  return await post('/risk/tasks/', options, signal)
}