import tblBP from "./tblBP";
import tblPlan from "./tblPlan";
import tblBPParts from "./tblBPParts";
import tblSteps from "./tblSteps";

export { default as tbl } from "./tbl";
export { default as tblAccounts } from "./tblAccounts";
export { default as tblBP6 } from "./tblBP6";
export { default as tblBuildPEmployees } from "./tblBuildPEmployees";
export { default as tblBuildPParts } from "./tblBuildPParts";
export { default as tblBuildPProducts } from "./tblBuildPProducts";
export { default as tblBulidPHours } from "./tblBulidPHours";
export { default as tblCalibration } from "./tblCalibration";
export { default as tblChecks } from "./tblChecks";
export { default as tblColumn } from "./tblColumn";
export { default as tblComplaints } from "./tblComplaints";
export { default as tblContact } from "./tblContact";
export { default as tblCustomers } from "./tblCustomers";
export { default as tblECO } from "./tblECO";
export { default as tblEmployee } from "./tblEmployee";
export { default as tblErrorLog } from "./tblErrorLog";
export { default as tblForm } from "./tblForm";
export { default as tblFormData } from "./tblFormData";
export { default as tblFormNew } from "./tblFormNew";
export { default as tblFORMREPORTING } from "./tblFORMREPORTING";
export { default as tblHelp } from "./tblHelp";
export { default as tblInventory } from "./tblInventory";
export { default as tblInventoryTransactionDetails } from "./tblInventoryTransactionDetails";
export { default as tblInventoryTransactions } from "./tblInventoryTransactions";
export { default as tblInvestigationComplaint } from "./tblInvestigationComplaint";
export { default as tblInvestigations } from "./tblInvestigations";
export { default as tblJobDetail } from "./tblJobDetail";
export { default as tblJobOperations } from "./tblJobOperations";
export { default as tblJobs } from "./tblJobs";
export { default as tblLinkedJobs } from "./tblLinkedJobs";
export { default as tblMainRptBP } from "./tblMainRptBP";
export { default as tblMaintainenceOrders } from "./tblMaintainenceOrders";
export { default as tblMaintainenceReports } from "./tblMaintainenceReports";
export { default as tblMaintReportMeasurements } from "./tblMaintReportMeasurements";
export { default as tblMedia } from "./tblMedia";
export { default as tblMessages } from "./tblMessages";
export { default as tblMRP1 } from "./tblMRP1";
export { default as tblMRPPlanning } from "./tblMRPPlanning";
export { default as tblNonConformance } from "./tblNonConformance";
export { default as tblNonConformanceTags } from "./tblNonConformanceTags";
export { default as tblOperationHoursWorked } from "./tblOperationHoursWorked";
export { default as tblOperationReworks } from "./tblOperationReworks";
export { default as tblOrder } from "./tblOrder";
export { default as tblOrderDetail } from "./tblOrderDetail";
export { default as tblOrganization } from "./tblOrganization";
export { default as tblPAComplaint } from "./tblPAComplaint";
export { default as tblPAInvestigation } from "./tblPAInvestigation";
export { default as tblPayableDetail } from "./tblPayableDetail";
export { default as tblPayables } from "./tblPayables";
export { default as tblPermissions } from "./tblPermissions";
export { default as tblPO } from "./tblPO";
export { default as tblPODetail } from "./tblPODetail";
export { default as tblPreventiveActions } from "./tblPreventiveActions";
export { default as tblProjectBranch } from "./tblProjectBranch";
export { default as tblProjectGoals } from "./tblProjectGoals";
export { default as tblQualifications } from "./tblQualifications";
export { default as tblRequisition } from "./tblRequisition";
export { default as tblRequisitionDetail } from "./tblRequisitionDetail";
export { default as tblSavedForms } from "./tblSavedForms";
export { default as tblSerialGroup } from "./tblSerialGroup";
export { default as tblServiceReport } from "./tblServiceReport";
export { default as tblSettings } from "./tblSettings";
export { default as tblShippingCombinations } from "./tblShippingCombinations";
export { default as tblShippingRates } from "./tblShippingRates";
export { default as tblSiteVisit } from "./tblSiteVisit";
export { default as tblSkills } from "./tblSkills";
export { default as tblSourceCodes } from "./tblSourceCodes";
export { default as tblState } from "./tblState";
export { default as tblTalents } from "./tblTalents";
export { default as tblTasks } from "./tblTasks";
export { default as tblTerritories } from "./tblTerritories";
export { default as tblTerritoryStates } from "./tblTerritoryStates";
export { default as tblTimeVerify } from "./tblTimeVerify";
export { default as tblTraining } from "./tblTraining";
export { default as tblUtility } from "./tblUtility";
export { default as tblVendorInvoice } from "./tblVendorInvoice";
export { default as tblVendorInvoiceDetail } from "./tblVendorInvoiceDetail";
export { default as tblVendors } from "./tblVendors";
export { default as tblWorkCenterGroup } from "./tblWorkCenterGroup";
export { default as tblWorkCenters } from "./tblWorkCenters";
export { default as tblWorkDone } from "./tblWorkDone";
export { default as tblWorkOrders } from "./tblWorkOrders";
export { default as tblWorkStation } from "./tblWorkStation";
export { default as tblWorkStationReports } from "./tblWorkStationReports";
export { default as tblZipLocations } from "./tblZipLocations";
export { default as tblZoneChart } from "./tblZoneChart";
export { default as tmpImport } from "./tmpImport";
export { default as vwServiceReportListing } from "./vwServiceReportListing";
export { default as tblPurchase } from "./tblPurchase";
export { default as tblCurrentInventory } from "./tblCurrentInventory"

// Associations with Aliases

// tblBP has many tblBPParts
tblBP.hasMany(tblBPParts, { foreignKey: 'partid', sourceKey: 'UniqueID' });
tblBPParts.belongsTo(tblBP, { foreignKey: 'partid', targetKey: 'UniqueID' });

tblSteps.hasMany(tblBPParts, { foreignKey: 'stepid', sourceKey: 'UniqueID'});
tblBPParts.belongsTo(tblSteps, { foreignKey: 'stepid', targetKey: 'UniqueID' });


tblPlan.hasMany(tblSteps, { foreignKey: 'PLANID', sourceKey: 'UniqueID' });
tblSteps.belongsTo(tblPlan, { foreignKey: 'PLANID', targetKey: 'UniqueID' });


// tblBP has many tblPlan
// tblBP.hasMany(tblPlan, { foreignKey: 'instanceid', sourceKey: 'instanceID', as: 'plans' }); 
// tblPlan.belongsTo(tblBP, { foreignKey: 'instanceid', targetKey: 'instanceID', as: 'bp' });


export {
  tblBP,
  tblPlan,
  tblBPParts,
  tblSteps,
};
