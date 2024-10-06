// import { defineEventHandler, createError } from 'h3'
// import sequelize from '~/server/utils/databse'

import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

async function executeQuery(query) {
    try {
        const [results] = await sequelize.query(query)
        return results
    } catch (err) {
        console.error('SQL error', err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Database query failed',
        })
    }
}

async function fetchZipData(zipCode) {
    const query = `SELECT Latitude, Longitude FROM tblZipLocations WHERE Zipcode = '${zipCode}'`
    const result = await executeQuery(query)
    // if (result.length === 0) {
    //     throw createError({
    //         statusCode: 404,
    //         statusMessage: `No data found for zip code ${zipCode}`,
    //     })
    // }
    return result || null
}

async function fetchDataForFilter(filterType, filterProduct, filterProduct2) {
    let query = ""
    let replacements = { filterProduct, filterProduct2 }

    switch (filterType) {
        case "openorder":
            query = `
                SELECT Zip, tblorder.orderID, company1, fullname, address, tblOrderDetail.type as model 
                FROM tblOrder 
                INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
                JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
                JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
                WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate = '' 
                AND PRODUCTLINE = 'CRYOTherm'
                ORDER BY zip
            `
            break
        case "fieldservice":
            query = `
                SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, 
                       tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo 
                FROM tblComplaints 
                JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid 
                WHERE (SELECT COUNT(tblServiceReport.uniqueID) FROM tblServiceReport 
                       WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID 
                       AND tblServiceReport.REPAIRDESC = 0) > 0 AND (opencase = 0) 
                AND (ProductDesc LIKE '%CRYOTherm%' OR ProductDesc LIKE '%Console%')
                ORDER BY Zip
            `
            break
        case "sitevisit":
            query = `
                SELECT Zip, tblsitevisit.visitID, company1, fullname, address, city, state  
                FROM tblSiteVisit 
                INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblSiteVisit.customerid 
                WHERE status <> 'Closed' AND PRODUCTLINE = CRYOTherm
                ORDER BY zip
            `
            break
        case "orderpending":
            query = `
                SELECT Zip, tblorder.orderID, company1, fullname, address, tblorderdetail.type as model 
                FROM tblOrder 
                INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
                JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
                JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
                WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = ''  
                AND Status = 'Order Pending' AND PRODUCTLINE = 'CRYOTherm'
                ORDER BY zip
            `
            break
        case "openquote":
            query = `
                SELECT Zip, tblorder.orderID, company1, fullname, address, tblorderdetail.type as model  
                FROM tblOrder 
                INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
                JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
                JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
                WHERE (quotenumber <> 0 OR quotenumber IS NOT NULL) AND orderdate = ''  
                AND Status = 'Open' AND PRODUCTLINE = 'CRYOTherm'
                ORDER BY zip
            `
            break
        case "shipped":
            query = `
                SELECT DISTINCT Zip, tblorder.orderID, company1, fullname, address, Serial,
                (SELECT TOP 1 tblbp.PRODUCTLINE FROM tblBP 
                 WHERE tblBp.instanceID = (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid)
                 ORDER BY uniqueid DESC) as ProductLine 
                FROM tblOrderDetail 
                JOIN tblOrder ON tblOrderDetail.orderid = tblOrder.UniqueID 
                INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
                WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate <> '' 
                AND (SELECT TOP 1 tblbp.PRODUCTLINE FROM tblBP 
                     WHERE tblBp.instanceID = (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid)
                     ORDER BY uniqueid DESC) = 'CRYOTherm'
                ORDER BY zip
            `
            break
        case "checkup":
            query = `
                SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, 
                       tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo 
                FROM tblComplaints 
                JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid 

            `
            break
        default:
            throw createError({
                statusCode: 400,
                statusMessage: `Invalid filter type: ${filterType}`,
            })
    }

    return await executeQuery(query)
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const filterStates = body

        const filterProduct = 'CRYOTherm'
        const filterProduct2 = 'CRYOTherm'

        let features = []

        for (const [filterType, isChecked] of Object.entries(filterStates)) {
            if (isChecked) {
                const data = await fetchDataForFilter(filterType, filterProduct, filterProduct2)
                let currentZip = ''
                let currentContent = ''

                for (const item of data) {
                    if (item.Zip !== currentZip) {
                        if (currentZip) {
                            const zipData = await fetchZipData(currentZip.substring(0, 5))
                            features.push({
                                latitude: zipData?.Latitude,
                                longitude: zipData?.Longitude,
                                type: filterType,
                                id: 0,
                                title: currentZip,
                                content: currentContent,
                            })
                        }
                        currentZip = item.Zip
                        currentContent = ''
                    }

                    const buttonContent = item.SerialNo || item.model || `${item.city}, ${item.state}` || item.fullname
                    currentContent += `<button onclick="Routing('${item.uniqueID || item.orderID || item.visitID}','${filterType}')">${buttonContent}</button>`
                }

                // Add the last group
                if (currentZip) {
                    const zipData = await fetchZipData(currentZip.substring(0, 5))
                    if (!zipData) {
                        features.push({
                            latitude: zipData.Latitude,
                            longitude: zipData.Longitude,
                            type: filterType,
                            id: 0,
                            title: currentZip,
                            content: currentContent,
                        })
                    }
                }
            }
        }

        return features

    } catch (error) {
        console.error('Error in API handler:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal server error',
        })
    }
})




// export default defineEventHandler(async (event) => {
//     // const { filterProduct, filterProduct2 } = getQuery(event);
//     const filterProduct = 'CRYOTherm'
//     const filterProduct2 = 'CRYOTherm'
//     try {
//         const data = {
//             pendingInstallations: await getPendingInstallations(filterProduct),
//             openServiceReports: await getOpenServiceReports(filterProduct2),
//             openSiteVisits: await getOpenSiteVisits(filterProduct),
//             ordersPending: await getOrdersPending(filterProduct),
//             orderQuotes: await getOrderQuotes(filterProduct),
//             shippedOrders: await getShippedOrders(filterProduct),
//             openCheckups: await getOpenCheckups(filterProduct2)
//         };

//         return data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return createError({
//             statusCode: 500,
//             statusMessage: 'Error fetching data'
//         });
//     }
// });

// async function getPendingInstallations(filterProduct) {
//     const [results] = await sequelize.query(`
//     SELECT Zip, tblorder.orderID, company1, fullname, address, tblOrderDetail.type as model 
//     FROM tblOrder 
//     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
//     JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
//     JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
//     WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate = '' AND PRODUCTLINE = :filterProduct 
//     ORDER BY zip
//   `, {
//         replacements: { filterProduct },
//     });

//     return results;
// }

// async function getOpenServiceReports(filterProduct2) {
//     const [results] = await sequelize.query(`
//     SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo 
//     FROM tblComplaints 
//     JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid 
//     WHERE (SELECT count(tblServiceReport.uniqueID) FROM tblServiceReport WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0 
//     AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0) 
//     ORDER BY Zip
//   `, {
//         replacements: { filterProduct2 },
//     });

//     return results;
// }

// async function getOpenSiteVisits(filterProduct) {
//     const [results] = await sequelize.query(`
//     SELECT Zip, tblsitevisit.visitID, company1, fullname, address, city, state  
//     FROM tblSiteVisit 
//     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblSiteVisit.customerid 
//     WHERE (status != 'Closed') AND PRODUCTLINE = :filterProduct 
//     ORDER BY zip
//   `, {
//         replacements: { filterProduct },
//     });

//     return results;
// }

// async function getOrdersPending(filterProduct) {
//     const [results] = await sequelize.query(`
//     SELECT Zip, tblorder.orderID, company1, fullname, address, tblorderdetail.type as model 
//     FROM tblOrder 
//     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
//     JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
//     JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
//     WHERE (quotenumber != 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Order Pending') AND PRODUCTLINE = :filterProduct 
//     ORDER BY zip
//   `, {
//         replacements: { filterProduct },
//     });

//     return results;
// }

// async function getOrderQuotes(filterProduct) {
//     const [results] = await sequelize.query(`
//     SELECT Zip, tblorder.orderID, company1, fullname, address, tblorderdetail.type as model  
//     FROM tblOrder 
//     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
//     JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
//     JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
//     WHERE (quotenumber != 0 OR quotenumber IS NOT NULL) AND orderdate = '' AND Status IN ('Open') AND PRODUCTLINE = :filterProduct 
//     ORDER BY zip
//   `, {
//         replacements: { filterProduct },
//     });

//     return results;
// }

// async function getShippedOrders(filterProduct) {
//     const [results] = await sequelize.query(`
//     SELECT DISTINCT Zip, tblorder.orderID, company1, fullname, address, Serial,
//     (SELECT TOP 1 tblbp.PRODUCTLINE FROM tblBP WHERE tblBp.instanceID = (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueid DESC) as ProductLine 
//     FROM tblOrderDetail 
//     JOIN tblOrder ON tblOrderDetail.orderid = tblOrder.UniqueID 
//     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
//     WHERE (quotenumber = 0 OR quotenumber IS NULL) AND shipdate != '' 
//     AND (SELECT TOP 1 tblbp.PRODUCTLINE FROM tblBP WHERE tblBp.instanceID = (SELECT instanceID FROM tblBP bp2 WHERE bp2.UniqueID = tblOrderDetail.bpid) ORDER BY uniqueid DESC) = :filterProduct  
//     ORDER BY zip
//   `, {
//         replacements: { filterProduct },
//     });

//     return results;
// }

// async function getOpenCheckups(filterProduct2) {
//     const [results] = await sequelize.query(`
//     SELECT tblCustomers.Zip, tblComplaints.uniqueID, tblCustomers.company1, tblCustomers.fullname, tblCustomers.address, tblComplaints.SerialNo 
//     FROM tblComplaints 
//     JOIN tblCustomers ON tblCustomers.uniqueid = tblComplaints.customerid 
//     WHERE (SELECT count(tblServiceReport.uniqueID) FROM tblServiceReport WHERE tblServiceReport.ComplaintID = tblComplaints.uniqueID AND tblServiceReport.REPAIRDESC = 0) > 0 
//     AND (opencase = 0) AND (CHARINDEX(:filterProduct2, ProductDesc) > 0 OR CHARINDEX('Console', ProductDesc) > 0) 
//     AND ValidComplaintReason LIKE '%Checkup%' 
//     ORDER BY Zip
//   `, {
//         replacements: { filterProduct2 },
//     });

//     return results;
// }