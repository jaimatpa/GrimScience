import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';

const formatDate = (date) => {
  const today = new Date(date);
  return String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
  String(today.getDate()).padStart(2, '0') + '/' + 
  today.getFullYear();
}

function generateUniqueId() {
  const timestamp = Date.now(); // Get current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 1000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them
}

export const getFieldSales = async (filters) => {
  console.log(filters)
  try {
    // Parse the filters if they're passed as a string
    filters = typeof filters === 'string' ? JSON.parse(filters) : filters;

    // Declare counts
    let siteVisitCount = 0;
    let serviceReportsCount = 0;
    let installationCount = 0;

    // Initialize base queries
    let siteVisitQuery = `
      SELECT 
        tblSiteVisit.Status AS VisitStatus,
        tblSiteVisit.CustomerID AS CustID,
        CAST(VisitDate AS DATETIME) AS castedVisitDate,
        tblCustomers.NUMBER AS CustNumber,
        
        *
      FROM tblSiteVisit 
      LEFT JOIN tblCustomers ON tblCustomers.UniqueID = tblSiteVisit.CustomerID 
      WHERE 1=1`;

    // Fixed service report query to exactly match VB.NET version
    let serviceReportQuery = `
      SELECT 
        MAX(CAST(sr.REPAIRDATE AS DATETIME)) AS REPAIRDATE,
        MAX(c.UniqueID) AS CustID,
        MAX(c.NUMBER) AS CustNumber,
        MAX(sr.CANO) AS CANO,
        MAX(c.company1) AS Company,
        MAX(COMPLAINTNUMBER) AS COMPLAINTNUMBER,
        MAX(SERIALNO) AS SERIALNO,
        MAX(c.city) AS City,
        MAX(c.state) AS State,
        MAX(sr.RepairsBy) AS RepairedBy,
        MAX(sr.UniqueID) AS ServiceReportID,
        MAX(sr.ComplaintID) AS ComplaintID,
        MAX(comp.OPENCASE) AS Status,
        MAX(bp.Productline) AS Productline
      FROM tblServiceReport sr
      INNER JOIN tblComplaints comp ON comp.UniqueID = sr.ComplaintID
      INNER JOIN tblCustomers c ON c.UniqueID = comp.CustomerID
      LEFT JOIN tblBP bp ON bp.model = comp.MODELNO
      WHERE sr.UniqueID = (
        SELECT MAX(innerSR.UniqueID)
        FROM tblServiceReport innerSR
        WHERE innerSR.COMPLAINTID = comp.UniqueID
        AND 1=1`;

    let installationQuery = `
      SELECT 
        CAST(DatePromised AS DATETIME) AS DatePromised,
        tblOrder.orderid AS OrderID,
        tblCustomers.NUMBER AS CustNumber,
        tblCustomers.UniqueID AS CustID,
        tblCustomers.company1 AS Company,
        tblCustomers.city AS City,
        tblCustomers.state AS State,
        tblOrder.InstallationBy AS InstalledBy
      FROM tblOrder
      JOIN tblCustomers ON tblOrder.customerid = tblCustomers.UniqueID
      WHERE DatePromised IS NOT NULL AND DatePromised != '' AND 1=1`;

    // Add filters for Site Visits
    if (filters.tableFilters?.date) siteVisitQuery += ` AND VisitDate LIKE '${filters.tableFilters.date}%'`;
    if (filters.tableFilters?.customer) siteVisitQuery += ` AND tblCustomers.NUMBER LIKE '${filters.tableFilters.customer}%'`;
    if (filters.tableFilters?.company) siteVisitQuery += ` AND company1 LIKE '${filters.tableFilters.company}%'`;
    if (filters.tableFilters?.city) siteVisitQuery += ` AND city LIKE '${filters.tableFilters.city}%'`;
    if (filters.tableFilters?.state) siteVisitQuery += ` AND state LIKE '${filters.tableFilters.state}%'`;
    if (filters.tableFilters?.by) siteVisitQuery += ` AND [By] LIKE '${filters.tableFilters.by}%'`;
    if (filters.tableFilters?.siteVisit) siteVisitQuery += ` AND VisitNumber LIKE '${filters.tableFilters.siteVisit}%'`;
    if (!filters.includeReadyRefs) siteVisitQuery += ` AND Productline <> 'Ready Ref'`;

    // Add status filters for site visits
    if (filters.open && filters.closed) {
      siteVisitQuery += ` AND Status IN ('Open', 'Closed')`;
    } else if (filters.open) {
      siteVisitQuery += ` AND Status = 'Open'`;
    } else if (filters.closed) {
      siteVisitQuery += ` AND Status = 'Closed'`;
    }

    siteVisitQuery += ` ORDER BY castedVisitDate DESC`;

    // Add service report specific filters to the subquery
    let serviceReportSubqueryFilters = '';
    if (filters.tableFilters?.date) serviceReportSubqueryFilters += ` AND sr.RepairDate LIKE '${filters.tableFilters.date}%'`;
    if (filters.tableFilters?.customer) serviceReportSubqueryFilters += ` AND c.NUMBER LIKE '${filters.tableFilters.customer}%'`;
    if (filters.tableFilters?.company) serviceReportSubqueryFilters += ` AND c.company1 LIKE '${filters.tableFilters.company}%'`;
    if (filters.tableFilters?.city) serviceReportSubqueryFilters += ` AND c.city LIKE '${filters.tableFilters.city}%'`;
    if (filters.tableFilters?.state) serviceReportSubqueryFilters += ` AND c.state LIKE '${filters.tableFilters.state}%'`;
    if (filters.tableFilters?.by) serviceReportSubqueryFilters += ` AND sr.RepairsBy LIKE '${filters.tableFilters.by}%'`;
    if (filters.tableFilters?.complaint) serviceReportSubqueryFilters += ` AND COMPLAINTNUMBER LIKE '${filters.tableFilters.complaint}%'`;
    if (filters.tableFilters?.serviceReport) serviceReportSubqueryFilters += ` AND sr.CANO LIKE '${filters.tableFilters.serviceReport}%'`;
    if (!filters.includeReadyRefs) serviceReportSubqueryFilters += ` AND bp.Productline <> 'Ready Ref'`;

    // Add status filters for service reports
    if (filters.open && filters.closed) {
      serviceReportSubqueryFilters += ` AND comp.OPENCASE IN ('1', '0')`;
    } else if (filters.open) {
      serviceReportSubqueryFilters += ` AND comp.OPENCASE = '0'`;
    } else if (filters.closed) {
      serviceReportSubqueryFilters += ` AND comp.OPENCASE = '1'`;
    }

    // Complete the service report query
    serviceReportQuery += serviceReportSubqueryFilters + `) GROUP BY sr.ComplaintID ORDER BY MAX(CAST(sr.REPAIRDATE AS DATETIME)) DESC`;

    // Add filters for installations
    if (filters.tableFilters?.date) installationQuery += ` AND DatePromised LIKE '${filters.tableFilters.date}%'`;
    if (filters.tableFilters?.customer) installationQuery += ` AND tblCustomers.NUMBER LIKE '${filters.tableFilters.customer}%'`;
    if (filters.tableFilters?.company) installationQuery += ` AND company1 LIKE '${filters.tableFilters.company}%'`;
    if (filters.tableFilters?.city) installationQuery += ` AND city LIKE '${filters.tableFilters.city}%'`;
    if (filters.tableFilters?.state) installationQuery += ` AND state LIKE '${filters.tableFilters.state}%'`;
    if (filters.tableFilters?.by) installationQuery += ` AND tblOrder.InstallationBy LIKE '${filters.tableFilters.by}%'`;
    if (filters.tableFilters?.installation) installationQuery += ` AND orderid LIKE '${filters.tableFilters.installation}%'`;

    // Add date filters for installations
    if (filters.open && !filters.closed) {
      installationQuery += ` AND CAST(DatePromised AS DATETIME) >= '${new Date().toISOString()}'`;
    } else if (!filters.open && filters.closed) {
      installationQuery += ` AND CAST(DatePromised AS DATETIME) <= '${new Date().toISOString()}'`;
    }

    installationQuery += ` ORDER BY DatePromised DESC`;

    // Execute queries based on filters
    let siteVisitResults = [];
    let serviceReportResults = [];
    let installationResults = [];

    if (filters.siteVisits) {
      siteVisitResults = await sequelize.query(siteVisitQuery, { type: QueryTypes.SELECT });
      siteVisitCount = siteVisitResults.length;
    }

    if (filters.serviceReport) {
      serviceReportResults = await sequelize.query(serviceReportQuery, { type: QueryTypes.SELECT });
      serviceReportsCount = serviceReportResults.length;
    }

    if (filters.installations) {
      installationResults = await sequelize.query(installationQuery, { type: QueryTypes.SELECT });
      installationCount = installationResults.length;
    }
    console.log(siteVisitResults[0])
    siteVisitResults = siteVisitResults.map((site) => {
      return {
        date: formatDate(site.VisitDate),
        id: generateUniqueId(),
        visitId:site.VisitID,
        customerId: site.CustID,
        customer: site.CustNumber,
        company: site.comapny1,
        city: site.city,
        state: site.state,
        by: site.By,
        siteVisit: site.VisitNumber,
        status: site.VisitStatus
      }
    })

    serviceReportResults = serviceReportResults.map((service) => {
      return {
        id: generateUniqueId(),
        date: formatDate(service.REPAIRDATE) ,
        serviceReportId:service.ServiceReportID,
        complaintId: service.ComplaintID,
        customerId: service.CustID,
        serialNo: service.SERIALNO,
        customer: service.CustNumber,
        company: service.Company,
        city: service.city,
        state: service.state,
        by: service.RepairedBy,
        complaint: service.COMPLAINTNUMBER,
        serviceReport: service.CANO,
        status: service.Status == 0 ? 'Open' : 'Close'
      }
    })

    installationResults = installationResults.map((ins) => {
      return {
        id: generateUniqueId(),
        date: formatDate(ins.DatePromised),
        customerId:ins.CustID,
        orderId:ins.OrderID,
        customer: ins.CustNumber,
        company: ins.Company,
        city: ins.city,
        state: ins.state,
        by: ins.InstalledBy,
        installation: ins.OrderID,
        status: new Date(ins.DatePromised) > new Date() ? 'Open' : 'Closed'
      }
    })

    return {
      siteVisitResults,
      serviceReportResults,
      installationResults,
      siteVisitCount,
      serviceReportsCount,
      installationCount
    };

  } catch (error) {
    console.error("Error loading grid data:", error);
    throw error;
  }
};


export const getExcelSalesReport = async ( filters, startDate, endDate) => {
  try {
    filters = JSON.parse(filters)
    // Start building the query string
    let queryStr = "SELECT * FROM vwSales WHERE 1=1";
    
    for(const key in filters.tableFilters){
      if(filters.tableFilters[key]){
        queryStr += ` AND ${key} LIKE '${filters.tableFilters[key]}%'`;
      }
      
    }

    // Applying additional filters (productline, model, etc.)
    if (filters.productline) {
        queryStr += ` AND productline = '${filters.productline}'`;
    }
    if (filters.model) {
        queryStr += ` AND (model LIKE '%${filters.model}%' OR model IS NULL)`;
    }
    if (filters.market) {
        queryStr += ` AND (market LIKE '%${filters.market}%' OR market IS NULL)`;
    }
    if (filters.profession) {
        queryStr += ` AND (csource LIKE '%${filters.profession}%' OR csource IS NULL)`;
    }
    if (filters.category) {
        queryStr += ` AND (csourcedescription LIKE '%${filters.category}%' OR csourcedescription IS NULL)`;
    }
    if (filters.confrence) {
        queryStr += ` AND (sourceconfrence LIKE '%${filters.confrence}%' OR sourceconfrence IS NULL)`;
    }
    if (filters.state) {
        queryStr += ` AND (state LIKE '%${filters.state}%' OR state IS NULL)`;
    }
    if (filters.zip) {
        queryStr += ` AND (zip LIKE '%${filters.zip}%' OR zip IS NULL)`;
    }
    if (filters.source) {
        queryStr += ` AND (source LIKE '%${filters.source}%' OR source IS NULL)`;
    }
    if (filters.sourceDescription) {
        queryStr += ` AND (sourcedescription LIKE '%${filters.sourceDescription}%' OR sourcedescription IS NULL)`;
    }

    startDate = formatDate(startDate)
    endDate = formatDate(endDate)

    queryStr += ` AND CAST(OrderDate AS DATETIME) BETWEEN '${startDate}' AND '${endDate}'`

    // Execute the raw SQL query
    const results = await sequelize.query(queryStr, { type: QueryTypes.SELECT });
    
    // Return the results
    return { results };

  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

