import { useState } from "react";
import SettingsHeader from "./SettingsHeader";
import SecurityQuestionnaires from "./SecurityQuestionnaires";
import FalconAITemplates from "./FalconAITemplates";
import RiskScoreFormula from "./RiskScoreFormula";
import SecurityReviewFrequency from "./SecurityReviewFrequency";
import TabPanel from "../TabPanel";

const VendorSettings = () => {
  // State for conditionally rendering the active tab
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <SettingsHeader activeTab={activeTab} handleChange={handleChange} />
      <TabPanel activeTab={activeTab} index={0}>
        <SecurityQuestionnaires />
      </TabPanel>
      <TabPanel activeTab={activeTab} index={1}>
        <FalconAITemplates />
      </TabPanel>
      <TabPanel activeTab={activeTab} index={2}>
        <RiskScoreFormula />
      </TabPanel>
      <TabPanel activeTab={activeTab} index={3}>
        <SecurityReviewFrequency />
      </TabPanel>
    </>
  );
};

export default VendorSettings;
