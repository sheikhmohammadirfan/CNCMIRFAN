import { post } from "../CrudFactory";

export async function getActions(options) {
  const res = await post('/risk/tasks/', options)
  // console.log(res);
  return { data: res }
}