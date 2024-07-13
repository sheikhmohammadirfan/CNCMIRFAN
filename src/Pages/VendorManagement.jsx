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
import { listVendors } from "../Service/VendorManagement/VendorManagement.service";

const VendorManagement = ({ title }) => {
  DocumentTitle(title);

  const [vendorList, setVendorList] = useState([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  // Fetch the list of vendors.
  useEffect(() => {
    (async () => {
      startLoading();
      try {
        const { data } = await listVendors();
        if (data) {
          setVendorList(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    })();
  }, []);

  return (
    <Box>
      <Switch>
        <Route exact path="/vendor_management">
          <Redirect to="/vendor_management/risk_dashboard" />
        </Route>
        <Route exact path="/vendor_management/requirement_analysis">
          <Discovery
            isLoading={isLoading}
            vendorList={vendorList}
          />
        </Route>
        <Route exact path="/vendor_management/risk_dashboard">
          <VendorRiskDashboard />
        </Route>
        <Route exact path="/vendor_management/assessment">
          <VendorAssessment
            isLoading={isLoading}
            vendorList={vendorList}
          />
        </Route>
        <Route exact path="/vendor_management/procurement">
          <VendorProcurement />
        </Route>
        <Route exact path="/vendor_management/onboard">
          <VendorOnboard />
        </Route>
        <Route exact path="/vendor_management/security_review">
          <SecurityReview />
        </Route>
        <Route exact path="/vendor_management/compliance_reports">
          <VendorComplianceReports />
        </Route>
        <Route exact path="/vendor_management/settings">
          <VendorSettings />
        </Route>
        <Route exact path="/vendor_management/:vendorId">
          <VendorDetails
            isLoading={isLoading}
            vendorList={vendorList}
          />
        </Route>
      </Switch>
    </Box>
  );
};

export default VendorManagement;
