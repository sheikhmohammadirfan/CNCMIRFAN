import { cia_categories } from "../assets/data/RiskManagement/RiskRegisterFilters";
import { risk_register_rows } from "../assets/data/RiskManagement/RiskRegisterMockData"

export async function getRegister(owners, likelihoodScores, impactScores) {
  return new Promise(res => {
    setTimeout(() => {
      // Adding "inherent_risk_score" and "residual_risk_score" in rows by multiplying individual scores i.e likelihoods and impacts
      let data = risk_register_rows.map((row, index) => {

        // Calculating scores based on id of scores. first we find score object with that id, then we get the score from found object
        let inherent_score = (likelihoodScores.length === 0 || impactScores.length === 0) ? "" :
          likelihoodScores?.find(score => score.id === risk_register_rows[index].inherent_risk_likelihood_id).score
          *
          impactScores?.find(score => score.id === risk_register_rows[index].inherent_risk_impact_id).score

        let residual_score = (likelihoodScores.length === 0 || impactScores.length === 0) ? "" :
          likelihoodScores?.find(score => score.id === risk_register_rows[index].inherent_risk_likelihood_id).score
          *
          impactScores?.find(score => score.id === risk_register_rows[index].inherent_risk_impact_id).score

        let owner = owners.length === 0 ? "" :
          owners.find(owner => owner.id === risk_register_rows[index].owner).name

        return {
          id: risk_register_rows[index].id,
          scenario: risk_register_rows[index].scenario,
          owner: owner,
          identified_date: risk_register_rows[index].identified_date,
          modified_date: risk_register_rows[index].modified_date,
          cia: cia_categories.filter(ciaCategory => row.cia.includes(ciaCategory.id)).map(category => category.text),
          custom_id: risk_register_rows[index].custom_id,
          inherent_risk_score: inherent_score,
          residual_risk_score: residual_score,
          notes: risk_register_rows[index].notes,
          treatment: risk_register_rows[index].treatment,
          task_ids: risk_register_rows[index].task_ids,
          is_approved: risk_register_rows[index].is_approved,
          is_archived: risk_register_rows[index].is_archived,
          vendors: risk_register_rows[index].vendors
        }
      });

      const localRegister = localStorage.getItem("risk-register");
      if (!localRegister) {
        localStorage.setItem("risk-register", JSON.stringify(data))
        res({ data: data, status: true })
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

