import { get, post, put } from "../CrudFactory";

export async function getOrgs(data) {
  return await post('/adminpanel/listadmin/', data);
}

export async function addOrg(data) {
  return await post('/adminpanel/clientadmin/', data);
} 

export async function updateOrg(data) {
  return await put('/adminpanel/clientadmin/', data);
}

export async function inviteUsers(data) {
  return await post('/adminpanel/invite/', data);
}