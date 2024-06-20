import { cia_categories } from "../assets/data/RiskManagement/RiskRegisterFilters";
import { risk_register_rows } from "../assets/data/RiskManagement/RiskRegisterMockData"

export async function getRegister(owners, likelihoodScores, impactScores) {
  return new Promise(res => {
    setTimeout(() => {
      const localRegister = localStorage.getItem("risk-register");
      if (!localRegister) {
        localStorage.setItem("risk-register", JSON.stringify(risk_register_rows))
        res({ data: risk_register_rows, status: true })
      }
      else {
        res({ data: JSON.parse(localRegister), status: true })
      }
    }, 1000)
  })
}

export async function getInherentRisks() {
  await new Promise((res) => setTimeout(() => res()), 1000);
  return { data: [], status: true }
}

export async function getResidualRisks() {
  await new Promise((res) => setTimeout(() => res()), 1000);
  return { data: [], status: true }
}