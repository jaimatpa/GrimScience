import { DATE, Op, QueryTypes, Sequelize } from 'sequelize';
import models from '~/server/api/jobs/models';
import { tblBP, tblInventoryTransactionDetails, tblInventoryTransactionDetails } from "~/server/models";
import sequelize from '~/server/utils/databse';

export const getProductLines = async () => {
  const distinctProductInfos = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: '' } }
      ]
    },
    order: [
      ['PRODUCTLINE', 'ASC'],
    ]
  });

  const productLineValues = distinctProductInfos.map(result => result.get('PRODUCTLINE'));

  return productLineValues;
}

export const getProductCategories = async (filterParams) => {
  const { productline, partflag } = filterParams
  let where = {}
  if(productline) where['PRODUCTLINE'] = productline
  if(partflag) where['partflag'] = partflag
  const distinctProductCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PARTTYPE')), 'PARTTYPE']
    ],
    where: {
      [Op.and]: [
        { PARTTYPE: { [Op.ne]: null } },
        { PARTTYPE: { [Op.ne]: '' } }
      ],
      ...where
    },
    order: [
      ['PARTTYPE', 'ASC'],
    ]
  });
  
  const productLineValues = distinctProductCategories.map(result => result.get('PARTTYPE'));

  return productLineValues;
}

export const getProductSubCategories = async (filterParams) => {
  const { productline, category, partflag } = filterParams
  let where = {}
  if(productline !== undefined) where['PRODUCTLINE'] = productline
  if(category !== undefined) where['PARTTYPE'] = category
  if(partflag) where['partflag'] = partflag
  const distinctProductSubCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SUBCATEGORY')), 'SUBCATEGORY']
    ],
    where: {
      [Op.and]: [
        { SUBCATEGORY: { [Op.ne]: null } },
        { SUBCATEGORY: { [Op.ne]: '' } }
      ],
      ...where
    },
    order: [
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  const productLineValues = distinctProductSubCategories.map(result => result.get('SUBCATEGORY'));

  return productLineValues;
}

export const getProductInfos = async (params) => {
  const { productline, category, subcategory, model, stock } = params
  let whereClause = {
    [Op.and]: [
      { PRIMARYPRICE1: { [Op.ne]: null } },
      { PRIMARYPRICE1: { [Op.ne]: '' } }
    ]
  };
  if (productline) {
    whereClause['PRODUCTLINE'] = productline
  } else return []
  if (category) {
    whereClause['PARTTYPE'] = category
  }
  if (subcategory) {
    whereClause['SUBCATEGORY'] = subcategory
  }
  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'PRODUCTLINE',
      'PARTTYPE',
      'SUBCATEGORY',
      'PRIMARYPRICE1',
      'DESCRIPTION'
    ],
    where: whereClause,
    limit: 50,
    order: [
      ['PRODUCTLINE', 'ASC'],
      ['PARTTYPE', 'ASC'],
      ['SUBCATEGORY', 'ASC'],
    ]
  });

  return productInfos;
}

export const getParts = async (filterParams) => {
  console.log("param for part",filterParams);
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams
  let where = {}
  if(UniqueID) where['UniqueID'] = UniqueID
  if(PARTTYPE) where['PARTTYPE'] = PARTTYPE
  if(SUBCATEGORY) where['SUBCATEGORY'] = SUBCATEGORY
  if(MODEL) where['MODEL'] = {[Op.like]: `%${MODEL}%`}
  if(DESCRIPTION) where['DESCRIPTION'] = {[Op.like]: `%${DESCRIPTION}%`}

  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT'
    ],
    where: {
      partflag: 1,
      ...where
    },
    limit: 50,
    order: [
      ['MODEL', 'ASC'],
    ],
    raw: true
  });

  return productInfos;
}

export const getDistinctParts = async (filterParams) => {
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams
  let where = {}
  if(UniqueID) where['UniqueID'] = UniqueID
  if(PARTTYPE) where['PARTTYPE'] = PARTTYPE
  if(SUBCATEGORY) where['SUBCATEGORY'] = SUBCATEGORY
  if(MODEL) where['MODEL'] = {[Op.like]: `%${MODEL}%`}
  if(DESCRIPTION) where['DESCRIPTION'] = {[Op.like]: `%${DESCRIPTION}%`}

  const getDistinctByModelNumber = (data) => {
    const uniquePrices = new Map();

    data.forEach(item => {
      if (!uniquePrices.has(item.MODEL)) {
        uniquePrices.set(item.MODEL, item);
      }
    });
  
    return Array.from(uniquePrices.values());
  };

  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT'
    ],
    where: {
      partflag: 1,
      ...where
    },
    // limit: 50,
    order: [
      ['MODEL', 'ASC'],
    ],
    raw: true
  });

  const distinctFilteredData = getDistinctByModelNumber(productInfos);

  return distinctFilteredData;
}


export const getAllParts = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  console.log("products aree");

  // Determine the number of records to fetch per page, default to 50
  const limit = parseInt(pageSize, 10) || 50;

  // Calculate the offset for pagination, default to 0 (first page)
  const offset = ((parseInt(page, 10) - 1) || 0) * limit;

  // Apply filters based on the filterParams object
  const whereClause = applyPartFilters(filterParams);

  // Fetch the parts data from the database
  const productInfos = await tblBP.findAll({
    attributes: [
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT',
      'ETLCriticalComponent'
    ],
    where: {
      partflag: 1,  // Only fetch parts with partflag = 1
      ...whereClause  // Include the dynamic filters
    },
    order: [[sortBy || 'MODEL', sortOrder || 'ASC']],  // Default sorting by 'MODEL' in ascending order
    offset,  // Start from the calculated offset
    limit,  // Limit the number of records to fetch
    raw: true  // Return the data as raw objects
  });

  return productInfos;
};

// Helper function to create the 'where' clause for filtering
const applyPartFilters = (params) => {
  // List of fields that can be filtered
  const filterParams = ['UniqueID', 'PARTTYPE', 'SUBCATEGORY', 'MODEL', 'DESCRIPTION','OnHand','ETLCriticalComponent'];
  const whereClause = {};

  // Iterate over each filterable field
  filterParams.forEach(param => {
    if (params[param]) {
      // If a filter value is provided, add a 'LIKE' condition to the whereClause
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  return whereClause;
};
export const getNumberOfParts = async (filterParams) => {
  // Apply filters based on the filterParams object
  const whereClause = applyPartFilters(filterParams);

  // Count the number of parts that match the filter criteria
  const numberOfParts = await tblBP.count({
    where: {
      partflag: 1,  // Only count parts with partflag = 1
      ...whereClause  // Include the dynamic filters
    }
  });

  return numberOfParts;
};
export const PartsExistByID = async (id) => {
  try {
    const count = await tblBP.count({
      where: { UniqueID: id }
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking if part exists:", error);
    throw error; // You may choose to handle errors differently based on your application's needs
  }
};

export const getPartsDetail = async (id) => {
  try {
    const part = await tblBP.findOne({
      where: { UniqueID: id }
    });
    return part;
  } catch (error) {
    console.error("Error fetching part details:", error);
    throw error; // Handle errors as appropriate for your application
  }
};

export const updateParts = async (id, updateData) => {
  try {
    updateData.TODAY = updateData.TODAY || new Date();
    const [updated] = await tblBP.update(updateData, {
      where: { UniqueID: id }
    });
    return updated ? id : null;
  } catch (error) {
    console.error("Error updating part:", error);
    throw error; // Handle errors as appropriate for your application
  }
};

export const deleteParts = async (id) => {
  try {
    const deleted = await tblBP.destroy({
      where: { UniqueID: id }
    });
    return deleted ? id : null;
  } catch (error) {
    console.error("Error deleting part:", error);
    throw error; // Handle errors as appropriate for your application
  }
};



export const getPOPartsDetailsByUniqueId = async (UniqueID) => {
  console.log("unique id is",UniqueID)
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
    // Raw SQL query to insert data into tblPODetail
    const [result] = await sequelize.query(
      `INSERT INTO tblPODetail (ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT,POUID, PTNUM)
            VALUES (:ORDERED, :RECEIVED, :DESCRIPTION, :STOCKNUMBER, :PARTNUMBER, :UNITPRICE, :UNIT, :AMOUNT,:POUID, :PTNUM)`,
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
        type: QueryTypes.INSERT
      }
    );

    return { success: true, message: 'PO detail saved successfully', result };
  } catch (error) {
    throw new Error(`Error saving PO detail: ${error.message}`);
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





export const getPODetailsByInstanceId = async (instanceId:any) => {
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


export const getInventoryTransactionsByModel = async (model: any) => {
  console.log('modle is ',model);
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

export const getVendorNames = async () => {
  try {
    // Define the raw SQL query with DISTINCT
    const query = 'SELECT DISTINCT Name FROM tblVendors';

    // Execute the raw query
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    // Transform results to get an array of names
    const names = results.map(result => result.Name);

    // Return the array of names
    return names;
  } catch (error) {
    console.error('Error fetching vendor names:', error);
    throw error;
  }
};
export const getRevisions = async (instanceId:any) => {
  try {
      const bpList = await tblBP.findAll({
          attributes: ['uniqueid', 'today', 'code', 'revisedby'],
          where: {
              instanceid: instanceId
          },
          order: [
              [Sequelize.literal('CAST(today AS DATETIME)'), 'DESC']
          ],
          raw: true
      });
      return bpList;
  } catch (error) {
      throw new Error(`Error fetching data for instanceId ${instanceId} from table tblBP: ${error.message}`);
  }
};


export const getTotalRequiredByModel = async (model:any) => {
  try {
    const query = `
      SELECT number, ROUND(SUM(required), 0) AS TotalRequired
      FROM MRP8
      WHERE model = :model
      GROUP BY number
    `;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { model: model },
      type: QueryTypes.SELECT,
      raw: true
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching data for model ${model} from table MRP8: ${error.message}`);
  }
};


