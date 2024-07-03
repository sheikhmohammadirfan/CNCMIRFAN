import { mock_users } from "../../assets/data/RiskManagement/UsersMock";
import { get } from "../CrudFactory";

export async function getCategories() {
  return await get("/risk/categories/");
}

export async function getOwners() {
  return await get("/risk/users/");
}

export async function getLikelihoodScores() {
  return await get("/risk/likelihood_scores/");
}

export async function getImpactScores() {
  return await get("/risk/impact_scores/");
}
