import { Op, Sequelize } from 'sequelize';
import { tblBP, tblVendors } from "~/server/models";
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
  const limit = pageSize;
  const offset = (page - 1) * limit;
  console.log(searchTerm )
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
        attributes: ['Model', 'Description', 'UniqueId'],
        where: whereClause,
        order: [['Model', 'ASC']],
        limit,
        offset,
      }),
      tblBP.count({
        where: whereClause,
        distinct: true,
        col: 'InstanceId'
      })
    ]);

    return {
      parts,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error('Error fetching vendor supplied parts:', error);
    throw error;
  }
};