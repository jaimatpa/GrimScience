import { Op, QueryTypes, Sequelize } from 'sequelize';
import { tblBP, tblPO, tblPODetail, tblVendors } from "~/server/models";
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
export const getInventoryTransactionsByModel = async (model: string) => {
  try {
    const query = `
          SELECT tblInventoryTransactions.*, 
          tblInventoryTransactions.UniqueID AS UID, 
          tblInventoryTransactionDetails.onhand AS onhandITD, 
          QtyChange, 
          tblBP.Description, 
          tblBP.model
          FROM tblInventoryTransactionDetails
          LEFT JOIN tblInventoryTransactions ON tblInventoryTransactionDetails.InventoryTransactionID = tblInventoryTransactions.UniqueID
          LEFT JOIN tblBP ON tblBP.UniqueID = tblInventoryTransactionDetails.BPID
          WHERE tblBP.model = :model
          ORDER BY tblInventoryTransactions.dated DESC;
`;

    const results = await sequelize.query(query, {
      replacements: { model: model },
      type: QueryTypes.SELECT,
    });
    console.log(results);
    return results;

  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    throw error;
  }
};


export const getPODetailsByInstanceId = async (instanceId) => {
  try {
    // Execute raw SQL query
    const results = await sequelize.query(
      `SELECT
        tblpo.ponumber,
        tblpo.uniqueid,
        tblpo.date,
        tblpo.NAME,
        tblpodetail.ORDERED,
        tblpodetail.RECEIVED
        FROM tblpo
        INNER JOIN tblpodetail ON tblpodetail.pouid = tblpo.uniqueid
        INNER JOIN tblbp ON tblbp.uniqueid = tblpodetail.ptnum
        WHERE tblbp.instanceid = :instanceId
        ORDER BY CAST(tblpo.date AS DATETIME) DESC;
`,
      {
        replacements: { instanceId },
        type: QueryTypes.SELECT,
      }
    );

    return results;
  } catch (error) {
    console.error('Error fetching PO details:', error);
    throw error;
  }
};

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
export const getPOPartsDetailsByUniqueId = async (UniqueID) => {
  console.log(UniqueID)
  try {
    const query = `
      SELECT *
      FROM tblPODetail
      WHERE POUID = :UniqueID
    `;

    const results = await sequelize.query(query, {
      replacements: { UniqueID },
      type: QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return results;
    }

    throw new Error('PODetail not found');
  } catch (error) {
    console.error('Error querying PO parts details:', error);
    throw error;
  }
};


export async function savePODetailByUniqueId(data) {
  const {
    ORDERED,
    RECEIVED,
    DESCRIPTION,
    STOCKNUMBER,
    PARTNUMBER,
    UNITPRICE,
    UNIT,
    AMOUNT,
    POUID,
    PTNUM
  } = data;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Raw SQL query to insert data into tblPODetail
      await sequelize.query(
        `INSERT INTO tblPODetail (ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT, POUID, PTNUM)
            VALUES (:ORDERED, :RECEIVED, :DESCRIPTION, :STOCKNUMBER, :PARTNUMBER, :UNITPRICE, :UNIT, :AMOUNT, :POUID, :PTNUM)`,
        {
          replacements: {
            ORDERED,
            RECEIVED,
            DESCRIPTION,
            STOCKNUMBER,
            PARTNUMBER,
            UNITPRICE,
            UNIT,
            AMOUNT,
            POUID,
            PTNUM
          },
          type: QueryTypes.INSERT,
          transaction
        }
      );

      // Query the database to retrieve the inserted data
      const [result] = await sequelize.query(
        `SELECT * FROM tblPODetail WHERE POUID = :POUID AND PTNUM = :PTNUM`,
        {
          replacements: {
            POUID,
            PTNUM
          },
          type: QueryTypes.SELECT,
          transaction
        }
      );

      // Commit the transaction
      await transaction.commit();

      return { success: true, message: 'PO detail saved successfully', data: result };
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
      throw new Error(`Error saving PO detail: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Transaction error: ${error.message}`);
  }
}


export async function deletePODetailByStockNumber(stockNumber) {
  console.log(stockNumber);
  try {
    // Raw SQL query to delete data from tblPODetail by STOCKNUMBER
    const result = await sequelize.query(
      `DELETE FROM tblPODetail WHERE STOCKNUMBER = :stockNumber`,
      {
        replacements: { stockNumber },
        type: QueryTypes.DELETE
      }
    );

    return { success: true, message: 'PO detail deleted successfully', result };
  } catch (error) {
    throw new Error(`Error deleting PO detail: ${error.message}`);
  }
}
