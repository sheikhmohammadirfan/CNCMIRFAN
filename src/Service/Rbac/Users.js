import { post, put } from '../CrudFactory'

export async function getUsers(data) {
  return await post('/user/listusers/', data);
}

export async function addRole(data) {
  return await post('/user/adduser/', data)
}

export async function editUserRoles(data) {
  return await post('/rbac/roles/manage/', data)
}

export async function uploadUserSheet(data) {
  return await post('/user/importusers/', data)
}

export async function inviteUsers(data) {
  return await post('user/inviteusers/', data)
}

export async function updateUser(data) {
  return await put('user/updateuser/', data)
}