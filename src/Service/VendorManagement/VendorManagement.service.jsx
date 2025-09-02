import { get, post, put, deletes } from "../CrudFactory";

/* Method to create a new Vendor */
export async function createVendor(data) {
  return await post("/vendor/vendors/create/", data);
}

/* Method to list all Vendors */
export async function listVendors(payload) {
  return await post("/vendor/vendors/", payload);
}

/* Method to fetch a specific Vendor by ID */
export async function fetchVendor(id) {
  return await get(`/vendor/vendors/${id}/`);
}

/* Method to update a Vendor by ID */
export async function updateVendor(id, data) {
  return await put(`/vendor/vendors/update/${id}/`, data);
}

/* Method to delete a Vendor by ID */
export async function deleteVendor(id) {
  return await deletes(`/vendor/vendors/delete/${id}/`);
}

/* Method to list managed Vendors */
export async function listManagedVendors() {
  return await get("/vendor/vendors/managed/");  // doesn't work "unable to list managed vendors"
}

export async function createSecurityReview(payload) {
  return await post("/vendor/security-reviews/create/", payload);
}

export async function getSecurityReview() {
  return await get("/vendor/security-reviews/");
}

export async function listFindings() {
  return await get("/vendor/findings/");
}

export async function createFinding(payload) {
  return await post("/vendor/findings/create/", payload);
}

export async function updateFinding(id, data) {
  return await put(`/vendor/findings/update/${id}/`, data);
}

export async function deleteFinding(id) {
  return await deletes(`/vendor/findings/delete/${id}/`);
}

export async function listReferences() {
  return await get("/vendor/references/");
}

export async function createReferences(payload) {
  return await post("/vendor/references/create/", payload);
}

export async function updateReferences(id, data) {
  return await put(`/vendor/references/update/${id}`, data);
}

export async function deleteReference(id) {
  return await deletes(`vendor/references/${id}`);
}