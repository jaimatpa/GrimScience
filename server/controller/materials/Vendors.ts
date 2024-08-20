import { Op, QueryTypes, Sequelize } from 'sequelize';
import { tblBP, tblInventoryTransactionDetails, tblInventoryTransactions, tblVendors } from "~/server/models";
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
    attributes: ['UniqueId', 'NUMBER', 'NAME', 'ZIP'],
    where: whereClause,
    order: [[sortBy as string || 'NUMBER', sortOrder as string || 'ASC']],
    offset,
    limit
  });

  return list;
}

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
  WHERE tblBP.model = '300587'
  ORDER BY tblInventoryTransactions.dated DESC;
`;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT, // Specify the query type
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
      `SELECT ponumber, TBLPO.UNIQUEID, tblPO.Date, name 
       FROM tblpo 
       INNER JOIN tblpodetail ON tblpodetail.pouid = tblpo.uniqueid 
       INNER JOIN tblbp ON tblbp.uniqueid = tblpodetail.ptnum 
       WHERE tblbp.instanceid = :instanceId 
       ORDER BY CAST(tblPO.date AS DATETIME) DESC`,
      {
        replacements: { instanceId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return results;
  } catch (error) {
    console.error('Error fetching PO details:', error);
    throw error;
  }
};