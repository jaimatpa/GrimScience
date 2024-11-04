import { Op, Sequelize } from "sequelize";
import sequelize from "../../utils/databse";
import {
  tblSiteVisit,
  tblCustomers,
  tblState,
  tblTerritories,
  tblTerritoryStates,
  tblEmployee,
  tblBP,
} from "~/server/models";

const buildFilterString = async (params) => {
  const conditions = [];

  if (params.VisitDate) {
    conditions.push(`
      VisitDate IN (
        SELECT VisitDate 
        FROM tblSiteVisit 
        WHERE CAST(VisitDate AS DATE) LIKE '%${params.VisitDate}%'
      )
    `);
  }
  if (params.Reason) {
    conditions.push(`Reason LIKE '${params.Reason}%'`);
  }
  if (params.VisitNumber) {
    conditions.push(`VisitNumber LIKE '${params.VisitNumber}%'`);
  }
  if (params.ProductLine) {
    conditions.push(`ProductLine = '${params.ProductLine}'`);
  }
  if (params.By) {
    conditions.push(`tblSiteVisit.[By] = '${params.By}'`);
  }
  if (params.Number) {
    conditions.push(`Number LIKE '${params.Number}%'`);
  }
  if (params.company1) {
    conditions.push(`company1 LIKE '${params.company1}%'`);
  }
  if (params.city) {
    conditions.push(`city LIKE '${params.city}%'`);
  }
  if (params.state) {
    conditions.push(`tblCustomers.state LIKE '${params.state}%'`);
  }
  if (params.source) {
    conditions.push(`tblCustomers.source LIKE '${params.source}%'`);
  }
  if (params.market) {
    conditions.push(`market LIKE '${params.market}%'`);
  }
  if (params.territory && !params.state) {
    const statesQuery = `
      SELECT State 
      FROM tblState 
      JOIN tblTerritoryStates ON tblTerritoryStates.StateID = tblState.UniqueID 
      JOIN tblTerritories ON tblTerritoryStates.TerritoryID = tblTerritories.TerritoryID 
      WHERE Name = '${params.territory}'
    `;
    const [states] = await sequelize.query(statesQuery);
    if (states.length > 0) {
      const stateList = states.map((s) => `'${s.State}'`).join(",");
      conditions.push(`tblState.state IN (${stateList})`);
    } else {
      conditions.push(`tblState.state IN ('%')`);
    }
  }

  if (params.status) {
    if (params.status === "both") {
      conditions.push(`Status IN ('Open', 'Closed')`);
    } else {
      conditions.push(`Status = '${params.status}'`);
    }
  }

  return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
};

export const getSiteVisits = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = (parseInt(page as string, 10) - 1 || 0) * limit;
  const filterString = await buildFilterString(filterParams);

  const query = `
    SELECT 
      tblCustomers.Number as Number,
      tblTerritories.Name as TerritoryName,
      tblCustomers.State as CState,
      tblState.State as stState,
      tblSiteVisit.VisitID,
      tblSiteVisit.CustomerID,
      tblSiteVisit.VisitDate,
      tblSiteVisit.Reason,
      tblSiteVisit.VisitNumber,
      tblSiteVisit.ProductLine,
      tblSiteVisit.[By],
      tblSiteVisit.Status,
      tblCustomers.company1,
      tblCustomers.city
    FROM tblSiteVisit 
    LEFT JOIN tblCustomers ON tblSiteVisit.CustomerID = tblCustomers.UniqueID 
    LEFT JOIN tblState ON tblCustomers.state = tblState.state 
    LEFT JOIN tblTerritoryStates ON tblTerritoryStates.stateID = tblState.UniqueID 
    LEFT JOIN tblTerritories ON tblTerritories.TerritoryID = tblTerritoryStates.TerritoryID 
    ${filterString}
    ORDER BY ${
      sortBy ? `${sortBy} ${sortOrder}` : "CAST(VisitDate as datetime2) DESC"
    }
    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY
  `;

  const [list] = await sequelize.query(query);
  return list;
};

export const exportAllSiteVisits = async (
  sortBy,
  sortOrder,
  filterParams
) => {
  const filterString = await buildFilterString(filterParams);

  const query = `
    SELECT 
      tblCustomers.Number as Number,
      tblTerritories.Name as TerritoryName,
      tblCustomers.State as CState,
      tblState.State as stState,
      tblSiteVisit.VisitID,
      tblSiteVisit.CustomerID,
      tblSiteVisit.VisitDate,
      tblSiteVisit.Reason,
      tblSiteVisit.VisitNumber,
      tblSiteVisit.ProductLine,
      tblSiteVisit.[By],
      tblSiteVisit.Status,
      tblCustomers.company1,
      tblCustomers.city
    FROM tblSiteVisit 
    LEFT JOIN tblCustomers ON tblSiteVisit.CustomerID = tblCustomers.UniqueID 
    LEFT JOIN tblState ON tblCustomers.state = tblState.state 
    LEFT JOIN tblTerritoryStates ON tblTerritoryStates.stateID = tblState.UniqueID 
    LEFT JOIN tblTerritories ON tblTerritories.TerritoryID = tblTerritoryStates.TerritoryID 
    ${filterString}
    ORDER BY ${
      sortBy ? `${sortBy} ${sortOrder}` : "CAST(VisitDate as datetime2) DESC"
    }
  `;

  const [list] = await sequelize.query(query);
  return list;
};
export const getSiteVisitByCustomerId = async (filterParams) => {
  let customerWhere = {}
  if (filterParams.CustomerID) customerWhere['CustomerID'] = { [Op.like]: `%${filterParams.CustomerID}%` };

  const list = await tblSiteVisit.findAll({
    attributes: ['VisitID', 'VisitDate', 'VisitNumber', 'Status', 'CustomerID'],
    where: customerWhere,
  });
  return list;
}

export const getNumberOfSiteVisits = async (filterParams) => {
  const filterString = await buildFilterString(filterParams);

  const query = `
    SELECT COUNT(*) as count
    FROM tblSiteVisit 
    LEFT JOIN tblCustomers ON tblSiteVisit.CustomerID = tblCustomers.UniqueID 
    LEFT JOIN tblState ON tblCustomers.state = tblState.state 
    LEFT JOIN tblTerritoryStates ON tblTerritoryStates.stateID = tblState.UniqueID 
    LEFT JOIN tblTerritories ON tblTerritories.TerritoryID = tblTerritoryStates.TerritoryID 
    ${filterString}
  `;

  const [result] = await sequelize.query(query);
  return result[0]?.count || 0;
};

export const getProductLines = async () => {
  const query = `
    SELECT DISTINCT productline 
    FROM tblBP 
    WHERE productflag = 1 
    AND productline <> 'Parts' 
    ORDER BY productline
  `;

  const [results] = await sequelize.query(query);
  return results.map((item) => item.productline);
};

export const getSiteVisitBy = async () => {
  const query = `
    SELECT CONCAT('#', payrollno, ' ', fname, ' ', lname) as name
    FROM tblEmployee 
    WHERE Active = 1 
    ORDER BY payrollnumber
  `;

  const [results] = await sequelize.query(query);
  return results.map((item) => item.name);
};

export const getStates = async (territory?: string) => {
  const query = territory
    ? `SELECT tblState.state 
     FROM tblTerritoryStates 
     RIGHT JOIN tblState ON tblState.UniqueID = tblTerritoryStates.StateID 
     JOIN tblTerritories ON tblTerritories.TerritoryID = tblTerritoryStates.TerritoryID 
     WHERE tblTerritories.Name = '${territory}'`
    : `SELECT tblState.state FROM tblState ORDER BY state`;

  const [results] = await sequelize.query(query);
  return results.map((item) => item.state);
};

export const getSiteVisitReasons = async () => {
  const query = `
    SELECT DISTINCT Reason 
    FROM tblSiteVisit 
    WHERE Reason IS NOT NULL 
    ORDER BY Reason
  `;

  const [results] = await sequelize.query(query);
  return results.map((item) => item.Reason);
};

//Add-Updated site-visit
export const updateSiteVisit = async (data) => {
  try {
    // Check if visit exists
    const existingVisit = await tblSiteVisit.findOne({
      where: { VisitID: data.visitId || null }
    });

    if (existingVisit) {
      // Update existing visit
      await tblSiteVisit.update({
        Status: data.Status === 'Closed' ? 'Closed' : 'Open',
        VisitDate: data.VisitDate,
        Reason: data.Reason,
        '[By]': data.bye,
        Comments: data.Comments,
        ProductLine: data.ProductLine,
        ComplaintNumber: data.ComplaintNumber,
        InvoiceNumber: data.InvoiceNumber,
        QuoteNumber: data.QuoteNumber,
        CustomerID: data.CustomerID
      }, {
        where: { VisitID: data.visitId }
      });

      return existingVisit.VisitID;
    } else {

      const maxVisitNumber = await tblSiteVisit.max('VisitNumber');
      const nextVisitNumber = (maxVisitNumber || 0) + 1;

      // Create new visit
      const newVisit = await tblSiteVisit.create({
        VisitNumber: nextVisitNumber,
        Status: data.Status === 'Closed' ? 'Closed' : 'Open',
        VisitDate: data.VisitDate,
        Reason: data.Reason,
        '[By]': data.bye,
        Comments: data.Comments,
        ProductLine: data.ProductLine,
        ComplaintNumber: data.ComplaintNumber,
        InvoiceNumber: data.InvoiceNumber,
        QuoteNumber: data.QuoteNumber,
        CustomerID: data.CustomerID
      });

      return newVisit.VisitID;
    }
  } catch (error) {
    throw new Error(`Error updating site visit: ${error.message}`);
  }
};


//Get selected site-visit data
export const getSiteVisitDetails = async (visitId) => {
  const query = `
    SELECT 
      tblSiteVisit.*,
      tblCustomers.number,
      tblCustomers.fname,
      tblCustomers.lname,
      tblCustomers.email,
      tblCustomers.position,
      tblCustomers.company1,
      tblCustomers.company2,
      tblCustomers.address,
      tblCustomers.city,
      tblCustomers.state,
      tblCustomers.zip,
      tblCustomers.workphone,
      tblCustomers.cellphone
    FROM tblSiteVisit 
    LEFT JOIN tblCustomers ON tblCustomers.UniqueID = tblSiteVisit.CustomerID 
    WHERE VisitID = ${visitId}`;

  const [siteVisit] = await sequelize.query(query);
  if (!siteVisit || siteVisit.length === 0) return null;
  const customerID = siteVisit[0].CustomerID;

  const [complaints, invoices, quotes] = await Promise.all([
    getComplaints(customerID),
    getInvoices(customerID),
    getQuotes(customerID)
  ]);

  return {
    siteVisit: siteVisit[0],
    relatedData: {
      complaints,
      invoices,
      quotes
    }
  };
};

const getComplaints = async (customerId) => {
  const query = `
    SELECT ComplaintNumber 
    FROM tblComplaints 
    WHERE CustomerID = ${customerId} 
    ORDER BY UniqueID DESC`;

  const [results] = await sequelize.query(query);
  return results.map(item => item.ComplaintNumber.toString());
};

const getInvoices = async (customerId) => {
  const query = `
    SELECT invoicenumber 
    FROM tblOrder 
    WHERE CustomerID = ${customerId} 
    ORDER BY UniqueID DESC`;

  const [results] = await sequelize.query(query);
  return results.map(item => item.invoicenumber.toString());
};

const getQuotes = async (customerId) => {
  const query = `
    SELECT quotenumber 
    FROM tblOrder 
    WHERE CustomerID = ${customerId} 
    AND quotenumber != '0'
    ORDER BY UniqueID DESC`;

  const [results] = await sequelize.query(query);
  return results.map(item => item.quotenumber.toString());
};

//Comments details
export const getCommentDetails = async (customerID) => {
  const [complaints, invoices, quotes] = await Promise.all([
    getComplaints(customerID),
    getInvoices(customerID),
    getQuotes(customerID)
  ]);

  return {
    relatedData: {
      complaints,
      invoices,
      quotes
    }
  };
};


//Delete
export const deleteSiteVisit = async (visitId: string | number) => {
  try {
    const query = `DELETE FROM tblSiteVisit WHERE VisitID = :visitId`;
    
    const result = await sequelize.query(query, {
      replacements: { visitId },
      type: sequelize.QueryTypes.DELETE
    });

    return result;
  } catch (error) {
    throw new Error(`Error deleting site visit: ${error.message}`);
  }
};


//Preview the details in PDF

export const getSiteVisitForPreview = async (visitId: string | number) => {
  try {
    const query = `
      SELECT 
        sv.*,
        c.Number,
        c.fname,
        c.lname,
        c.email,
        c.position,
        c.company1,
        c.company2,
        c.address,
        c.city,
        c.state,
        c.zip,
        c.workphone,
        c.cellphone
      FROM tblSiteVisit sv
      LEFT JOIN tblCustomers c ON c.UniqueID = sv.CustomerID
      WHERE VisitID = :visitId
    `;

    const [results] = await sequelize.query(query, {
      replacements: { visitId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!results) {
      throw new Error('No site visit found with the given ID');
    }

    return {
      siteVisit: results
    };

  } catch (error) {
    console.error('Error fetching site visit details:', error);
    throw new Error(`Error fetching site visit details: ${error.message}`);
  }
};