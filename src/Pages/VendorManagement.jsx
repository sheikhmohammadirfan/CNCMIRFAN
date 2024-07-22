import Discovery from "../Components/VendorManagement/NeedAssessment/Discovery";
import DocumentTitle from "../Components/DocumentTitle";
import { Box } from "@material-ui/core";
import { Route, Switch, Redirect } from "react-router-dom";
import VendorSettings from "../Components/VendorManagement/Settings/VendorSettings";
import VendorRiskDashboard from "../Components/VendorManagement/RiskDashboard/VendorRiskDashboard";
import VendorAssessment from "../Components/VendorManagement/VendorAssessment/VendorAssessment";
import VendorProcurement from "../Components/VendorManagement/VendorProcurement/VendorProcurement";
import VendorOnboard from "../Components/VendorManagement/VendorOnboard/VendorOnboard";
import VendorComplianceReports from "../Components/VendorManagement/VendorComplianceReports/VendorComplianceReports";
import SecurityReview from "../Components/VendorManagement/SecurityReview/SecurityReview";
import VendorDetails from "../Components/VendorManagement/VendorDetails/VendorDetails";
import { useState, useEffect } from "react";
import useLoading from "../Components/Utils/Hooks/useLoading";
import { getSecurityReview, listVendors } from "../Service/VendorManagement/VendorManagement.service";

const VendorManagement = ({ title }) => {
  DocumentTitle(title);

  const [load, setLoad] = useState(0);
  const reload = () => setLoad(p => p === 100 ? 0 : p+1);

  const [vendorList, setVendorList] = useState([]);
  const [securityReviewList, setSecurityReviewList] = useState([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  // Fetch the list of vendors and reviews.
  useEffect(() => {
    (async () => {
      startLoading();
      let res= await listVendors();
      if (res.status) {
        setVendorList(res.data);
      }
      res = await getSecurityReview();
      if (res.status) {
        setSecurityReviewList(res.data);
      }
      stopLoading();
    })();
  }, [load]);

  return (
    <Box>
      <Switch>
        <Route exact path="/vendor-management">
          <Redirect to="/vendor-management/risk-dashboard" />
        </Route>
        <Route exact path="/vendor-management/requirement-analysis">
          <Discovery
            isLoading={isLoading}
            vendorList={vendorList}
            reload={reload}
          />
        </Route>
        <Route exact path="/vendor-management/risk-dashboard">
          <VendorRiskDashboard
            isLoading={isLoading}
            vendorList={vendorList}
            securityReviewList={securityReviewList}
          />
        </Route>
        <Route exact path="/vendor-management/assessment">
          <VendorAssessment
            isLoading={isLoading}
            vendorList={vendorList}
            securityReviewList={securityReviewList}
            reload={reload}
          />
        </Route>
        <Route exact path="/vendor-management/procurement">
          <VendorProcurement />
        </Route>
        <Route exact path="/vendor-management/onboard">
          <VendorOnboard />
        </Route>
        <Route exact path="/vendor-management/security-review">
          <SecurityReview
            isLoading={isLoading}
            vendorList={vendorList}
            securityReviewList={securityReviewList}
            reload={reload}
            />
        </Route>
        <Route exact path="/vendor-management/compliance-reports">
          <VendorComplianceReports />
        </Route>
        <Route exact path="/vendor-management/settings">
          <VendorSettings />
        </Route>
        <Route exact path="/vendor-management/:vendorId">
          <VendorDetails
            isLoading={isLoading}
            vendorList={vendorList}
            securityReviewList={securityReviewList}            
            reload={reload}
          />
        </Route>
      </Switch>
    </Box>
  );
};

export default VendorManagement;
