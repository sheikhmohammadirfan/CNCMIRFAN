import { useCallback } from "react";

export default function useSlider(scores) {

  // FUNCTIONS TO GET A SCALED DOWN VALUE (1-5 OR 1-10) FROM A VALUE BETWEEN 0-100
  const getLikelihoodScore = useCallback((val) => {
    let min = 0;
    let max = 100;
    let newMin = 1;
    let newMax = scores.likelihoodScores.length;
    // Applying linear interpolation formula, to convert a value from 0-100 to an actual risk score
    let scaledValue = ((val - min) / (max - min)) * (newMax - newMin) + newMin;
    return scaledValue;
  }, [scores]);

  const getImpactScore = useCallback((val) => {
    let min = 0;
    let max = 100;
    let newMin = 1;
    let newMax = scores.impactScores.length;
    // Applying linear interpolation formula, to convert a value from 0-100 to an actual risk score
    let scaledValue = ((val - min) / (max - min)) * (newMax - newMin) + newMin;
    return scaledValue;
  }, [scores])

  // FUNCTIONS TO GET A VALUE BETWEEN 0-100 FROM A SMALLER VALUE, BETWEEN (0 - 5/10)
  const getLikelihoodSliderValue = useCallback((num) => {
    let min = 1;
    let max = scores.likelihoodScores.length;
    let newMin = 0;
    let newMax = 100;
    // Applying linear interpolation formula, to convert a small value from 0-5/10 to a value between 0-100
    let sliderValue = ((num - min) / (max - min)) * (newMax - newMin) + newMin;
    return sliderValue;
  }, [scores])

  const getImpactSliderValue = useCallback((num) => {
    let min = 1;
    let max = scores.impactScores.length;
    let newMin = 0;
    let newMax = 100;
    // Applying linear interpolation formula, to convert a small value from 0-5/10 to a value between 0-100
    let sliderValue = ((num - min) / (max - min)) * (newMax - newMin) + newMin;
    return sliderValue;
  }, [scores])

  return {
    getLikelihoodScore,
    getImpactScore,

    getLikelihoodSliderValue,
    getImpactSliderValue
  }
}