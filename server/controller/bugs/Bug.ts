import { tblFORMREPORTING } from "~/server/models"; 
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['uniqueid', 'formName', 'datea', 'employee', 'resolved', 'descr'];
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

export const getAllBugs = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const whereClause = applyFilters(filterParams);

  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const list = await tblFORMREPORTING.findAll({
    attributes: ['uniqueid', 'formName', 'complaintText', 'datea', 'employee', 'dvanceLevels', 'resolved', 'descr', 'cost', 'approved', 'resolveversion'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  
  return list;
};

export const createBug = async (data) => {
  const createReqData = {
    ...data,
  };

  const newCustomer = await tblFORMREPORTING.create(createReqData);

  return newCustomer
}

export const getBugDetail = async (id) => {
  const tableDetail = await tblFORMREPORTING.findByPk(id);
  return tableDetail
}

export const bugExistByID = async (id: number | string) => {
  const tableDetail = await tblFORMREPORTING.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const updateBug = async (id, reqData) => {
  await tblFORMREPORTING.update(reqData, {
    where: { uniqueid: id }
  });

  return id;
}

export const deleteBug = async (id) => {
  await tblFORMREPORTING.destroy({ where: { UniqueID: id } });
  return id;
}

export const getReportedForm = async () => {
   const reportedFormList = await tblFORMREPORTING.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('formName')), 'formName']],
  });
  return reportedFormList;
}