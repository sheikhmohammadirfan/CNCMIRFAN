import { get } from "../CrudFactory";

export async function fetchAccounts () {
  return await get('/access/get-access-list')
}