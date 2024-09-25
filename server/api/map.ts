import { defineEventHandler, getQuery } from "h3";
import { QueryTypes, Op } from "sequelize";
import sequelize from "../utils/databse";
import {
  tblBP,
  tblCustomers,
  tblOrder,
  tblOrderDetail,
  tblZipLocations,
} from "../models";

const filterProduct = process.env.FILTER_PRODUCT || "CRYOTherm";
const filterProduct2 = process.env.FILTER_PRODUCT2 || "CRYOTherm";

async function getLatLongMap(zipCodes) {
  const zipCodeRecords = await tblZipLocations.findAll({
    attributes: ['Zipcode', 'Latitude', 'Longitude'],
    where: {
      Zipcode: {
        [Op.in]: zipCodes,
      },
    },
  });

  return zipCodeRecords.reduce((acc, record) => {
    if (record.Latitude !== null && record.Longitude !== null) {
      acc[record.Zipcode] = { lat: record.Latitude, lng: record.Longitude };
    }
    return acc;
  }, {});
}


function processPinData(data, latLongMap, type) {
  return data.map((row) => {
    const trimmedZipCode = row.Zip.trim().substring(0, 5);

    return {
      position: latLongMap[trimmedZipCode] || null,
      type,
      id: row.orderID || row.uniqueID || row.visitID,
      title: row.company1,
      content: row.fullname,
      address: row.address,
      zip: trimmedZipCode,
      model: row.model,
      serialNo: row.SerialNo,
      city: row.city,
      state: row.state,
    };
  });
}

async function getPins() {
  const pins = [];
  const queries = [
    {
      query: `
    SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model 
    FROM tblOrder 
    INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
    JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
    JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
    WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate = '' AND PRODUCTLINE = :filterProduct
    ORDER BY Zip`,
      type: "pendingInstalls",
    },
    {
      query: `
      SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo
      FROM tblComplaints
      JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid
      WHERE (SELECT count(tblServiceReport.uniqueID)
             FROM tblServiceReport
             WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0
      AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0)
      ORDER BY Zip`,
      type: "serviceReports",
    },
    {
      query: `
      SELECT Zip, tblSiteVisit.visitID, company1, fullname, address, city, state
      FROM tblSiteVisit
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblSiteVisit.customerid
      WHERE (status <> 'Closed') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip`,
      type: "siteVisits",
    },
    {
      query: `
      SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model
      FROM tblOrder
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID
      JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
      WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Order Pending') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip`,
      type: "orderPendings",
    },
    {
      query: `
      SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model
      FROM tblOrder
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID
      JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
      WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Open') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip`,
      type: "openQuotes",
    },
    {
      query: `
      SELECT DISTINCT Zip, tblOrder.orderID, company1, fullname, address, Serial,
      (SELECT TOP 1 tblBP.PRODUCTLINE FROM tblBP WHERE tblBP.instanceID =
       (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueID DESC) as ProductLine
      FROM tblOrderDetail
      JOIN tblOrder ON tblOrderDetail.orderid = tblOrder.UniqueID
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate <> ''
      AND (SELECT TOP 1 tblBP.PRODUCTLINE FROM tblBP WHERE tblBP.instanceID =
       (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueID DESC) = :filterProduct
      ORDER BY Zip`,
      type: "shippedOrders",
    },
    {
      query: `
      SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo
      FROM tblComplaints
      JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid
      WHERE (SELECT count(tblServiceReport.uniqueID)
             FROM tblServiceReport
             WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0
      AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0)
      AND ValidComplaintReason LIKE '%Checkup%'
      ORDER BY Zip`,
      type: "checkups",
    },
  ];

  const results = await Promise.all(
    queries.map(({ query }) =>
      sequelize.query(query, {
        replacements: { filterProduct, filterProduct2 },
        type: QueryTypes.SELECT,
      })
    )
  );

  const allZipCodes = results.flat().map((row) => row.Zip.trim().substring(0, 5));
  const uniqueZipCodes = [...new Set(allZipCodes)];

  const latLongMap = await getLatLongMap(uniqueZipCodes);

  queries.forEach(({ type }, index) => {
    pins.push(...processPinData(results[index], latLongMap, type));
  });

  return pins;
}

async function getFeatures() {
  const features = [];

  const dt = await sequelize.query(
    `
      SELECT Zip, tblorder.orderID, company1, fullname, address 
      FROM tblOrder 
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
      JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
      WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Open') AND PRODUCTLINE = :filterProduct
    `,
    {
      replacements: { filterProduct },
      type: QueryTypes.SELECT,
    }
  );

  const allZipCodes = dt.map((row) => row.Zip.trim().substring(0, 5));
  const uniqueZipCodes = [...new Set(allZipCodes)];
  const latLongMap = await getLatLongMap(uniqueZipCodes);

  for (const row of dt) {
    const trimmedZipCode = row.Zip.trim().substring(0, 5);
    const feature = {
      position: latLongMap[trimmedZipCode] || null,
      type: "openQuote",
      id: row.orderID,
      title: row.company1,
      content: row.fullname,
      address: row.address,
      zip: trimmedZipCode,
    };
    features.push(feature);
  }

  return features;
}

export default defineEventHandler(async (event) => {
  const { action } = getQuery(event);

  switch (action) {
    case "getPins":
      return await getPins();
    case "getFeatures":
      return await getFeatures();
    default:
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid action",
      });
  }
});