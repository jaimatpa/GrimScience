// import sequelize from "~/server/utils/databse";

import sequelize from "~/server/utils/databse";


// export default async function handler(event) {
//     const filterProduct = getQuery(event);

//     try {
//         // Query to get ZIP locations
//         let [zipLocations] = await sequelize.query(`
//             SELECT * 
//             FROM tblZipLocations;
//         `);

//         // Query to get orders with relevant details
//         let [orders] = await sequelize.query(`
//                 SELECT 
//                     Zip, tblorder.orderID, company1, fullname, address 
//                 FROM 
//                     tblOrder 
//                     INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
//                     JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
//                     JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
//                 WHERE 
//                     (quotenumber IS NOT NULL AND quotenumber <> 0) 
//                     AND orderdate = '' 
//                     AND Status IN ('Open') 
//                     AND PRODUCTLINE = '${filterProduct}';
//             `);

//         // Process the data
//         const features = orders.map(order => {
//             const location = zipLocations.find(zip => zip.Zipcode === order.Zip);

//             if (location) {
//                 return {
//                     Latitude: location.Latitude,
//                     Longitude: location.Longitude,
//                     Type: 'openquote',
//                     ID: order.orderID.toString(),
//                     Title: order.company1,
//                     Content: order.fullname,
//                     Address: order.address,
//                 };
//             }
//             return null;
//         }).filter(feature => feature !== null);

//         // Serialize the result
//         return {
//             statusCode: 200,
//             body: features
//         };
//     } catch (error) {
//         console.error('Error fetching map data:', error);
//         return {
//             statusCode: 500,
//             body: { error: 'Internal Server Error' }
//         };
//     }
// }



export default defineEventHandler(async (event) => {
    const { filterProduct } = getQuery(event);

    try {
        // Fetch zip code data
        const dtZip = await sequelize.query("SELECT * FROM tblZipLocations");

        // Fetch order data
        const [dt] = await sequelize.query(`
      SELECT Zip, tblorder.orderID, company1, fullname, address 
      FROM tblOrder 
      INNER JOIN tblCustomers ON tblCustomers.uniqueid = tblOrder.customerid 
      JOIN tblOrderDetail ON tblOrderDetail.orderid = tblOrder.UniqueID 
      JOIN tblBP ON tblOrderDetail.bpid = tblbp.UniqueID
      WHERE (quotenumber != 0 OR quotenumber IS NOT NULL) 
        AND orderdate = '' 
        AND Status IN ('Open') 
        AND PRODUCTLINE = :filterProduct
    `,
            {
                replacements: { filterProduct }
            }
        );

        const features = dt.reduce((acc, dr) => {
            const locationRow = dtZip.find(row => row.Zipcode === dr.Zip);
            if (locationRow) {
                acc.push({
                    latitude: locationRow.Latitude,
                    longitude: locationRow.Longitude,
                    type: "openquote",
                    id: dr.orderID,
                    title: dr.company1,
                    content: dr.fullname,
                    address: dr.address
                });
            }
            return acc;
        }, []);

        return features;
    } catch (error) {
        console.error('Error fetching map data:', error);
        return createError({
            statusCode: 500,
            statusMessage: 'Error fetching map data'
        });
    }
});