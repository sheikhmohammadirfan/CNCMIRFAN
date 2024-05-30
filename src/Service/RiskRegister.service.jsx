import { risk_register_cols_map } from "../assets/data/RiskRegisterColumns";
import { risk_register_rows } from "../assets/data/RiskRegisterMockData"

export async function getRegister() {
  return new Promise(res => {
    setTimeout(() => {

      const data = {};

      Object.values(risk_register_cols_map).map((val, index) => {
        data[val] = {}
      })

      Object.keys(risk_register_rows).map((colName) => {
        data[risk_register_cols_map[colName]] = risk_register_rows[colName]
      })

      res({ data: data, status: true })
    }, 1000)
  })
}