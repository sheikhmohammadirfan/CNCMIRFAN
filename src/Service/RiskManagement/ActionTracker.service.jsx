import { get, post } from "../CrudFactory";

export async function getActions(options, signal) {
  return await post('/risk/tasks/', options, signal)
}

export async function exportAction() {
  return await get('/risk/tasks/export/')
}