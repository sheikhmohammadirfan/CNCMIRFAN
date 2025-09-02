import { deletes, get, patch, post } from '../CrudFactory'

export async function getPermissions() {
  return await get('/rbac/permissions/');
}

export async function getRoles() {
  return await get('/rbac/roles');
}

export async function addRole(data) {
  return await post('/rbac/roles/', data)
}

export async function editRole(id, data) {
  return await patch(`/rbac/roles/${id}/manage/`, data)
}

export async function deleteRole(id) {
  return await deletes(`/rbac/roles/${id}/manage/`);
}