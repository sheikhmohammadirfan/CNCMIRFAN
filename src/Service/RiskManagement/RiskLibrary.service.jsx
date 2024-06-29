import { HEADER_TABLE_NAME_MAP } from "../../assets/data/RiskManagement/RiskLibrary/LibraryColumns"
import { mockLibrary } from "../../assets/data/RiskManagement/RiskLibrary/MockLibrary"

export const getLibrary = () => {
  return new Promise(res => {
    setTimeout(() => {

      const mappedLibrary = mockLibrary.map((row, index) => {
        const mappedRow = {};
        Object.keys(row).map(key => {
          let mappedColName = HEADER_TABLE_NAME_MAP[key];
          mappedRow[mappedColName] = row[key];
        })
        return mappedRow;
      })

      res({ data: mappedLibrary, status: true })
    }, 2000)
  })
}