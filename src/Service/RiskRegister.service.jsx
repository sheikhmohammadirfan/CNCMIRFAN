import { HEADER_TABLE_COLS_MAP } from "../assets/data/RiskManagement/RiskRegisterColumns";
import { cia_categories } from "../assets/data/RiskManagement/RiskRegisterFilters";
import { risk_register_rows } from "../assets/data/RiskManagement/RiskRegisterMockData"

export async function getRegister(owners, likelihoodScores, impactScores) {
  return new Promise(res => {
    setTimeout(() => {

      // Setting keys to Column name that is being used to map columns.
      const mappedRegister = risk_register_rows.map(row => {
        let mappedRow = {}
        Object.keys(row).map(key => {
          let colName = HEADER_TABLE_COLS_MAP[key];
          mappedRow[colName] = row[key];
        })
        return mappedRow;
      })

      const localRegister = localStorage.getItem("risk-register");
      if (!localRegister) {
        localStorage.setItem("risk-register", JSON.stringify(mappedRegister))
        res({ data: mappedRegister, status: true })
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