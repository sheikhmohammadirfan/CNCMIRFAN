import { mock_users } from "../../assets/data/RiskManagement/UsersMock";
import { get } from "../CrudFactory";

export async function getCategories() {
  return await get("/risk/categories/");
}

export async function getOwners() {
  return new Promise((res) => {
    setTimeout(() => {
      // Adding "text" key, because filters use "text" key to populate data
      // "val" key is required by Select.control.jsx to set value of MenuItem component
      const users = mock_users.map(user => ({
        ...user,
        text: user.name,
        val: user.name
      }))
      res({ data: users, status: true })
    }, 1000)
  });
}

export async function getLikelihoodScores() {
  return await get("/risk/likelihood_scores/");
}

export async function getImpactScores() {
  return await get("/risk/impact_scores/");
}
