import { mock_categories } from "../assets/data/VendorManagement/CategoriesMock";
import {
  impact_scores,
  likelihood_scores,
} from "../assets/data/VendorManagement/RiskScoresMock";
import { mock_users } from "../assets/data/VendorManagement/UsersMock.js";

export async function getCategories() {
  return new Promise((res) => {
    setTimeout(() => {
      // Changing key name from "name" to "text". because "text" key is required to show in UI
      const categories = mock_categories.map((category, index) => ({
        ...category,
        text: category.name,
      }));
      res({ data: categories, status: true });
    }, 2000);
  });
}

export async function getOwners() {
  return new Promise((res) => {
    setTimeout(() => {
      // Adding "text" key, because filters use "text" key to populate data
      // "val" key is required by Select.control.jsx to set value of MenuItem component
      const users = mock_users.map((user) => ({
        ...user,
        text: user.name,
        val: user.name,
      }));
      res({ data: users, status: true });
    }, 1000);
  });
}

export async function getLikelihoodScores() {
  return new Promise((res) => {
    setTimeout(() => {
      res({ data: likelihood_scores, status: true });
    }, 2000);
  });
}

export async function getImpactScores() {
  return new Promise((res) => {
    setTimeout(() => {
      res({ data: impact_scores, status: true });
    }, 2000);
  });
}
