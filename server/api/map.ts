import { defineEventHandler, getQuery } from "h3";
import { QueryTypes, Op } from "sequelize";
import sequelize from "../utils/databse";
import { tblBP, tblCustomers, tblOrder, tblOrderDetail, tblZipLocations } from "../models";

const filterProduct = process.env.FILTER_PRODUCT || "CRYOTherm";
const filterProduct2 = process.env.FILTER_PRODUCT2 || "CRYOTherm";

async function getLatLong(zipCode) {
  const trimmedZipCode = zipCode.trim().substring(0, 5);

  const zipCodeRecord = await tblZipLocations.findOne({
    attributes: ['Latitude', 'Longitude'],
    where: {
      Zipcode: trimmedZipCode,
    },
  });

  if (zipCodeRecord) {
    const { Latitude, Longitude } = zipCodeRecord;
    return { lat: Latitude, lng: Longitude };
  } else {
    console.warn(`Zip code ${trimmedZipCode} not found in database.`);
    return null;
  }
}

function processPinData(data, type) {
  return data.map(async (row) => ({
    position: await getLatLong(row.Zip),
    type,
    id: row.orderID || row.uniqueID || row.visitID,
    title: row.company1,
    content: row.fullname,
    address: row.address,
    zip: row.Zip,
    model: row.model,
    serialNo: row.SerialNo,
    city: row.city,
    state: row.state,
  }));
}

async function getPins() {
  const pins = [];

  const pendingInstallations = await sequelize.query(
    `
    SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model 
    FROM tblOrder 
    INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
    JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
    JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
    WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate = '' AND PRODUCTLINE = :filterProduct
    ORDER BY Zip
  `,
    {
      replacements: { filterProduct },
      type: QueryTypes.SELECT,
    }
  );

  // const pendingInstallations = await tblOrder.findAll({
  //   attributes: [
  //     'Zip',
  //     'orderID',
  //     [sequelize.col('tblCustomers.company1'), 'company1'],
  //     [sequelize.col('tblCustomers.fullname'), 'fullname'],
  //     [sequelize.col('tblCustomers.address'), 'address'],
  //     [sequelize.col('tblOrderDetail.type'), 'model']
  //   ],
  //   include: [
  //     {
  //       model: tblCustomers,
  //       attributes: [],
  //       required: true,
  //     },
  //     {
  //       model: tblOrderDetail,
  //       attributes: [],
  //       required: true,
  //       include: [{
  //         model: tblBP,
  //         attributes: [],
  //         required: true,
  //       }]
  //     }
  //   ],
  //   where: {
  //     [Op.or]: [
  //       { quotenumber: 0 },
  //       { quotenumber: null }
  //     ],
  //     shipdate: '',
  //     PRODUCTLINE: filterProduct,
  //   },
  //   order: [['Zip', 'ASC']],
  // });

  pins.push(
    ...(await Promise.all(
      processPinData(pendingInstallations, "pendingInstalls")
    ))
  );

    const openServiceReports = await sequelize.query(
      `
      SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo
      FROM tblComplaints
      JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid
      WHERE (SELECT count(tblServiceReport.uniqueID)
             FROM tblServiceReport
             WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0
      AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0)
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct2 },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(openServiceReports, "serviceReports"))));

    const openSiteVisits = await sequelize.query(
      `
      SELECT Zip, tblSiteVisit.visitID, company1, fullname, address, city, state
      FROM tblSiteVisit
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblSiteVisit.customerid
      WHERE (status <> 'Closed') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(openSiteVisits, "siteVisits"))));

    const orderPending = await sequelize.query(
      `
      SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model
      FROM tblOrder
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID
      JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
      WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Order Pending') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(orderPending, "orderPendings"))));

    // Fetch Order Quote
    const orderQuote = await sequelize.query(
      `
      SELECT Zip, tblOrder.orderID, company1, fullname, address, tblOrderDetail.type as model
      FROM tblOrder
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID
      JOIN tblBP ON tblOrderDetail.bpid = tblBP.UniqueID
      WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Open') AND PRODUCTLINE = :filterProduct
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(orderQuote, "openQuotes"))));

    // Fetch Shipped Orders
    const shippedOrders = await sequelize.query(
      `
      SELECT DISTINCT Zip, tblOrder.orderID, company1, fullname, address, Serial,
      (SELECT TOP 1 tblBP.PRODUCTLINE FROM tblBP WHERE tblBP.instanceID =
       (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueID DESC) as ProductLine
      FROM tblOrderDetail
      JOIN tblOrder ON tblOrderDetail.orderid = tblOrder.UniqueID
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid
      WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate <> ''
      AND (SELECT TOP 1 tblBP.PRODUCTLINE FROM tblBP WHERE tblBP.instanceID =
       (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueID DESC) = :filterProduct
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(shippedOrders, "shippedOrders"))));

    // Fetch Open Checkups
    const openCheckups = await sequelize.query(
      `
      SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo
      FROM tblComplaints
      JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid
      WHERE (SELECT count(tblServiceReport.uniqueID)
             FROM tblServiceReport
             WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0
      AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0)
      AND ValidComplaintReason LIKE '%Checkup%'
      ORDER BY Zip
    `,
      {
        replacements: { filterProduct2 },
        type: QueryTypes.SELECT,
      }
    );

    pins.push(...(await Promise.all(processPinData(openCheckups, "checkups"))));

  console.log("pins", pins);

  return pins;
}

export default defineEventHandler(async (event) => {
  const { action } = getQuery(event);

  // Switch between different actions
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

  for (const row of dt) {
    const feature = {
      position: await getLatLong(row.Zip),
      type: "openQuote",
      id: row.orderID,
      title: row.company1,
      content: row.fullname,
      address: row.address,
    };
    features.push(feature);
  }

  return features;
}
