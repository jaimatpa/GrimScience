import { Op, Sequelize } from 'sequelize';
import { tblBP } from "~/server/models";

const applyFilters = (params) => {
  const filterParams = ['PRODUCTLINE', 'MODEL', 'DESCRIPTION', 'grossprofit'];
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

export const getProducts = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblBP.findAll({
    attributes: ['UniqueID', 'MODEL', 'DESCRIPTION', 'grossprofit', 'PRODUCTLINE'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getNumberOfProducts = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfProducts = await tblBP.count({
    where: whereClause
  });
  return numberOfProducts;
}

export const getProductLine = async () => {
  const result = await tblBP.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: '' } }
      ]
    },
    order: [['PRODUCTLINE', 'ASC']],
    raw: true
  });

  const distinctProductLine = result.map((item: any) => item.PRODUCTLINE);
  return distinctProductLine;
}
