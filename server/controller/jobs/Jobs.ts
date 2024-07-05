import { tblJobs } from "~/server/models";
import { Sequelize ,Op} from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['NUMBER','QUANTITY', 'MODEL','PerType','DATEOPENED', 'DATECLOSED','PercentageComplete','Cost','jobcat','jobsubcat','ProductionDate'];  
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

export const getAllJobs = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  
  
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  
  const whereClause = applyFilters(filterParams);
  
  const list = await tblJobs.findAll({
    attributes: ['UniqueID','NUMBER','QUANTITY', 'MODEL','PerType','DATEOPENED', 'DATECLOSED','PercentageComplete','Cost','jobcat','jobsubcat','ProductionDate'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getNumberOfJobs = async (filterParams) => {
    const whereClause = applyFilters(filterParams);
    const numberOfCustomers = await tblJobs.count({
      where: whereClause
    });
    return numberOfCustomers;
  }