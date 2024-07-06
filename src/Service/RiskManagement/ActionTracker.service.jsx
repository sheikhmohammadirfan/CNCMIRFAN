import { post } from "../CrudFactory";

export async function getActions(options, signal) {
  const res = await post('/risk/tasks/', options, signal)
  // console.log(res);
  return { data: res }
}