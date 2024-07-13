import { get, post, put, deletes } from "../CrudFactory";

/* Method to create a new Vendor */
export async function createVendor(data) {
  return await post("/vendor/vendors/create/", data);
}

/* Method to list all Vendors */
export async function listVendors() {
  return await get("/vendor/vendors/");
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