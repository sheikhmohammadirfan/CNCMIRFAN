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
import {
  getActiveRows,
  getArchivedRows,
} from "../Service/VendorManagement/Assessment.service";
import useLoading from "../Components/Utils/Hooks/useLoading";

const VendorManagement = ({ title }) => {
  DocumentTitle(title);

  const { isLoading, startLoading, stopLoading } = useLoading();

  // Rows for Vendor Assessment and Security Review
  const [activeRows, setActiveRows] = useState([]);
  const [archivedRows, setArchivedRows] = useState([]);

  useEffect(() => {
    (async () => {
      startLoading();
      try {
        const [activeRes, archivedRes] = await Promise.all([
          getActiveRows(),
          getArchivedRows(),
        ]);
        setActiveRows(activeRes.data);
        setArchivedRows(archivedRes.data);
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
          <Discovery setActiveRows={setActiveRows} />
        </Route>
        <Route exact path="/vendor_management/risk_dashboard">
          <VendorRiskDashboard />
        </Route>
        <Route exact path="/vendor_management/assessment">
          <VendorAssessment
            isLoading={isLoading}
            activeRows={activeRows}
            setActiveRows={setActiveRows}
            archivedRows={archivedRows}
            setArchivedRows={setArchivedRows}
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
        <Route exact path="/vendor_management/:id">
          <VendorDetails
            isLoading={isLoading}
            activeRows={activeRows}
            setActiveRows={setActiveRows}
            archivedRows={archivedRows}
            setArchivedRows={setArchivedRows}
          />
        </Route>
      </Switch>
    </Box>
  );
};

export default VendorManagement;
