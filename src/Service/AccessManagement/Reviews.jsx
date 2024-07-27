import { DECISION_ROWS_MOCK } from "../../assets/data/AccessManagement/ReviewDecisions/MockRows"
import { get, post } from "../CrudFactory"

export async function getReviews() {
  return await get("access/get-reviews/")
}

export async function getReviewEntities(id) {
  const data = {
    review_id: id
  }
  return await get("/access/get-review-entities", data)
}

export async function getReviewAccessList(id) {
  const data = {
    review_id: id
  }
  return await get(`/access/get-review-list`, data)
}

export async function getDecisions(id) {
  const data = {
    review_entity_id: id
  }
  return await get(`/access/get-review-list-by-review-entity`, data)
}

export async function getEntities() {
  return await get("access/get-entities/");
}

export async function postReview(data) {
  return await post("/access/create-review-with-add-entity-and-access/", data);
}

export async function approveReview(data) {
  return await post("/access/approve-review-list/", data);
}