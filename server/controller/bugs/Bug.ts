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

export const getAllBugs = async (filterParams) => {
  const whereClause = applyFilters(filterParams);

  const list = await tblFORMREPORTING.findAll({
    attributes: ['uniqueid', 'formName', 'complaintText', 'datea', 'employee', 'dvanceLevels', 'resolved', 'descr', 'cost', 'approved', 'resolveversion'],
    where: whereClause,
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