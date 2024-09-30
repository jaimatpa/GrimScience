import { Op, QueryTypes, Sequelize } from 'sequelize';
import { tblBP, tblOrganization, tblPO, tblPODetail, tblVendors, tblWorkCenters } from "~/server/models";
import sequelize from '~/server/utils/databse';
const applyFilters = (params) => {
  const filterParams = ['NUMBER', 'NAME', 'ZIP'];
  const whereClause = {};
  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });
  return whereClause;
};
export const getShippingMethods = async () => {
  const distinctShippingMethods = await tblVendors.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SHIPVIA')), 'SHIPVIA']
    ],
    where: {
      [Op.and]: [
        { SHIPVIA: { [Op.ne]: null } },
        { SHIPVIA: { [Op.ne]: '' } }
      ]
    },
    order: [
      ['SHIPVIA', 'ASC'],
    ]
  });

  const shippingMethods = distinctShippingMethods.map(result => result.get('SHIPVIA'));

  return shippingMethods;
}

export const getVendorList = async (page, pageSize, sortBy, sortOrder, filterParams) => {


  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  const whereClause = applyFilters(filterParams);

  const list = await tblVendors.findAll({
    where: whereClause,
    order: [[sortBy as string || 'NUMBER', sortOrder as string || 'ASC']],
    offset,
    limit
  });

  return list;
}
export const getVendorDetails = async (id) => {
  try {
    const numericId = parseInt(id, 10);

    const vendor = await tblVendors.findOne({
      where: {
        UniqueId: { [Op.eq]: numericId }
      },
    });

    return vendor;
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw error;
  }
};

export const getNumberOfVendors = async (filterParams) => {
  const whereClause = applyFilters(filterParams);

  const numberOfVendors = await tblVendors.count({
    where: whereClause
  });
  return numberOfVendors;
}



export const getVendorSuppliedParts = async (searchTerm: string, page: number = 1, pageSize: number = 10) => {

  const whereClause = {
    [Op.and]: [
      {
        [Op.or]: [
          { PrimaryMantxt: { [Op.like]: `%${searchTerm}%` } },
          { Alter1Mantxt: { [Op.like]: `%${searchTerm}%` } },
          { Alter2Mantxt: { [Op.like]: `%${searchTerm}%` } },
          { PrimaryDeatxt: { [Op.like]: `%${searchTerm}%` } },
          { Alter1Deatxt: { [Op.like]: `%${searchTerm}%` } },
          { Alter2Deatxt: { [Op.like]: `%${searchTerm}%` } },
        ]
      },
      Sequelize.where(Sequelize.col('UniqueId'), 'IN',
        Sequelize.literal(`(SELECT MAX(UniqueId) FROM tblBP GROUP BY InstanceId)`)
      )
    ]
  };

  try {
    const [parts, totalCount] = await Promise.all([
      tblBP.findAll({
        where: whereClause,
        order: [['Model', 'ASC']],
      }),
      tblBP.count({
        where: whereClause,
        distinct: true,
        col: 'InstanceId'
      })
    ]);

    return parts
  } catch (error) {
    console.error('Error fetching vendor supplied parts:', error);
    throw error;
  }
};
// export const getInventoryTransactionsByModel = async (model: string) => {
//   try {
//     const query = `
//           SELECT tblInventoryTransactions.*, 
//           tblInventoryTransactions.UniqueID AS UID, 
//           tblInventoryTransactionDetails.onhand AS onhandITD, 
//           QtyChange, 
//           tblBP.Description, 
//           tblBP.model
//           FROM tblInventoryTransactionDetails
//           LEFT JOIN tblInventoryTransactions ON tblInventoryTransactionDetails.InventoryTransactionID = tblInventoryTransactions.UniqueID
//           LEFT JOIN tblBP ON tblBP.UniqueID = tblInventoryTransactionDetails.BPID
//           WHERE tblBP.model = :model
//           ORDER BY tblInventoryTransactions.dated DESC;
// `;

//     const results = await sequelize.query(query, {
//       replacements: { model: model },
//       type: QueryTypes.SELECT,
//     });
//     console.log(results);
//     return results;

//   } catch (error) {
//     console.error('Error fetching inventory transactions:', error);
//     throw error;
//   }
// };


// export const getPODetailsByInstanceId = async (instanceId) => {
//   try {
//     // Execute raw SQL query
//     const results = await sequelize.query(
//       `SELECT
//         tblpo.ponumber,
//         tblpo.uniqueid,
//         tblpo.date,
//         tblpo.NAME,
//         tblpodetail.ORDERED,
//         tblpodetail.RECEIVED
//         FROM tblpo
//         INNER JOIN tblpodetail ON tblpodetail.pouid = tblpo.uniqueid
//         INNER JOIN tblbp ON tblbp.uniqueid = tblpodetail.ptnum
//         WHERE tblbp.instanceid = :instanceId
//         ORDER BY CAST(tblpo.date AS DATETIME) DESC;
// `,
//       {
//         replacements: { instanceId },
//         type: QueryTypes.SELECT,
//       }
//     );

//     return results;
//   } catch (error) {
//     console.error('Error fetching PO details:', error);
//     throw error;
//   }
// };

export const createVendor = async (vendorData) => {
  try {
    // Create a new vendor in the database
    const newVendor = await tblVendors.create(vendorData);
    return newVendor;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};


export const updateVendor = async (vendorData) => {
  try {
    const { UniqueID, ...updateData } = vendorData;

    // Find and update the vendor by UniqueID
    const [updated] = await tblVendors.update(updateData, {
      where: { UniqueID },
    });
    console.log(updated);
    if (updated) {
      // Retrieve the updated vendor
      const updatedVendor = await tblVendors.findOne({ where: { UniqueID } });
      return updatedVendor;
    }

    throw new Error('Vendor not found');
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};
export const getPoByVendor = async (vendor) => {
  try {
    const query = `
      SELECT *
      FROM tblpo
      WHERE vendor = :vendor
    `;

    const results = await sequelize.query(query, {
      replacements: { vendor },
      type: QueryTypes.SELECT
    });

    if (results.length > 0) {
      return results;
    }

    throw new Error('Vendor not found');
  } catch (error) {
    console.error('Error querying vendor:', error);
    throw error;
  }
};

export const getPOPartsDetails = async (model) => {
  console.log(model)
  try {
    const query = `
      SELECT *
      FROM tblPODetail
      WHERE STOCKNUMBER = :model
    `;

    const results = await sequelize.query(query, {
      replacements: { model },
      type: QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return results;
    }

    throw new Error('Parts Details not found');
  } catch (error) {
    console.error('Error querying PO parts details:', error);
    throw error;
  }
};
// export const getPOPartsDetailsByUniqueId = async (UniqueID) => {
//   console.log(UniqueID)
//   try {
//     const query = `
//       SELECT *
//       FROM tblPODetail
//       WHERE POUID = :UniqueID
//     `;

//     const results = await sequelize.query(query, {
//       replacements: { UniqueID },
//       type: QueryTypes.SELECT,
//     });

//     if (results.length > 0) {
//       return results;
//     }

//     throw new Error('PODetail not found');
//   } catch (error) {
//     console.error('Error querying PO parts details:', error);
//     throw error;
//   }
// };
// export async function savePODetailByUniqueId(data) {
//   // Validate data
//   const requiredFields = [
//     'ORDERED', 'RECEIVED', 'DESCRIPTION', 'STOCKNUMBER',
//     'PARTNUMBER', 'UNITPRICE', 'UNIT', 'AMOUNT',
//     'POUID', 'PTNUM'
//   ];

//   for (const field of requiredFields) {
//     if (data[field] === undefined) {
//       throw new Error(`Missing required field: ${field}`);
//     }
//   }

//   // Function to create a PO entry if vendor is present
//   const createPOEntry = async () => {
//     try {
//       const PO = await createNewPOEntry({
//         VENDORTERMS: data.vendor.TERMS,
//         PONUMBER: data.POUID,
//         VENDORFOB: data.vendor.FOB,
//         IREMAIL: data.vendor.IREMAIL,
//         IREXT: data.vendor.IREXT,
//         RejectReason: data.vendor.RejectReason,
//         IRFAX: data.vendor.IRFAX,
//         IRPHONE: data.vendor.IRPHONE,
//         IRNAME: data.vendor.IRNAME,
//         NAME: data.vendor.NAME,
//         ADDESS: data.vendor.ADDESS,
//         CITYSTATEZIP: `${data.vendor.CITY} ${data.vendor.STATE} ${data.vendor.ZIP}`,
//         VENDOR: data.vendor.NUMBER,
//         TOTAL: data.vendor.AMOUNT,
//         VENDORCUSTOMERNUMBER: data.vendor.CUSTNUMBER,
//         AuthorizedBy: data.vendor.ApprovedBy,
//         DATE: data.vendor.TODAY,
//         WEBSITE: data.vendor.WEBSITE,
//         SALESORDER: data.SALESORDER,
//         Notes: data.notes,
//         AMOUNT: data.AMOUNT,
//         VENDORDATE: data.VENDORDATE,
//         Shipto: data.Shipto,
//         OPENCLOSED: data.OPENCLOSED,
//       });
//       return PO.data;
//     } catch (e) {
//       console.error('Error creating new PO entry:', e);
//       throw new Error('Creating new PO failed: ' + e.message);
//     }
//   };

//   // Function to save PO detail in a transaction
//   const savePODetail = async () => {
//     const transaction = await sequelize.transaction();

//     try {
//       await sequelize.query(
//         `INSERT INTO tblPODetail (ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT, POUID, PTNUM)
//          VALUES (:ORDERED, :RECEIVED, :DESCRIPTION, :STOCKNUMBER, :PARTNUMBER, :UNITPRICE, :UNIT, :AMOUNT, :POUID, :PTNUM)`,
//         {
//           replacements: data,
//           type: QueryTypes.INSERT,
//           transaction
//         }
//       );

//       const [result] = await sequelize.query(
//         `SELECT * FROM tblPODetail WHERE POUID = :POUID AND PTNUM = :PTNUM`,
//         {
//           replacements: {
//             POUID: data.POUID,
//             PTNUM: data.PTNUM
//           },
//           type: QueryTypes.SELECT,
//           transaction
//         }
//       );

//       await transaction.commit();
//       return { success: true, message: 'PO detail saved successfully', data: result };
//     } catch (error) {
//       await transaction.rollback();
//       console.error('Error saving PO detail:', error);
//       throw new Error(`Error saving PO detail: ${error.message}`);
//     }
//   };

//   // If vendor data is present, create PO entry and return its data
//   if (data.vendor) {
//     return await createPOEntry();
//   }

//   // Otherwise, save PO detail and return the result
//   return await savePODetail();
// }

export async function createNewPOEntry(poData) {
  try {
    const newEntry = await tblPO.create(poData);
    console.log('New PO entry created successfully:', newEntry);
    return newEntry; // Return the newly created entry if needed
  } catch (error) {
    console.error('Error creating PO entry:', error);
    throw error; // Rethrow the error if you want to handle it elsewhere
  }
}
export async function updatePOEntry(id, poData) {
  try {
    const newEntry = await tblPO.update(poData, {
      where: {
        vendor: id
      }
    });
    console.log('New PO entry created successfully:', newEntry);
    return newEntry; // Return the newly created entry if needed
  } catch (error) {
    console.error('Error creating PO entry:', error);
    throw error; // Rethrow the error if you want to handle it elsewhere
  }
}
// export async function deletePODetailByStockNumber(stockNumber) {
//   console.log(stockNumber);
//   try {
//     // Raw SQL query to delete data from tblPODetail by STOCKNUMBER
//     const result = await sequelize.query(
//       `DELETE FROM tblPODetail WHERE STOCKNUMBER = :stockNumber`,
//       {
//         replacements: { stockNumber },
//         type: QueryTypes.DELETE
//       }
//     );

//     return { success: true, message: 'PO detail deleted successfully', result };
//   } catch (error) {
//     throw new Error(`Error deleting PO detail: ${error.message}`);
//   }
// }
export const fetchWorkCenters = async () => {
  try {
    const query = `
      SELECT tblWorkCenters.uniqueID AS uid, tblWorkCenters.*
      FROM tblWorkCenters
      LEFT JOIN tblOrganization ON tblOrganization.title = tblWorkCenters.position
      ORDER BY tblWorkCenters.number ASC;
    `;
    const [results, metadata] = await sequelize.query(query);
    return results
  } catch (error) {
    throw Error(`Error fetching work centers`);
  }
};