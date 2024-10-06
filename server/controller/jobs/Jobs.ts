import { tblJobDetail, tblJobs } from "~/server/models";
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PerType', 'DATEOPENED', 'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 'Cost', 'jobcat', 'jobsubcat', 'ProductionDate', 'JobID'];
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

const applyCusFilters = (params) => {
  const filterParams = ['JobID'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.in]: Array.isArray(params[param]) ? params[param] : [params[param]]
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
    attributes: ['UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PART', 'PerType', 'DATEOPENED', 'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 'Cost', 'jobcat', 'jobsubcat', 'ProductionDate'],
    where: whereClause,
    order: [[sortBy as string || 'NUMBER', sortOrder as string || 'ASC']],
    offset,
    limit
  });

  const formattedList = list.map((item: any) => {
    return {
      description: `${item.MODEL ? `#${item.MODEL}` : `#${item.PART}`}`,
      UniqueID: item.UniqueID,
      NUMBER: item.NUMBER,
      QUANTITY: item.QUANTITY,
      MODEL: item.MODEL,
      PART: item.PART,
      PerType: item.PerType,
      DATEOPENED: item.DATEOPENED,
      DATECLOSED: item.DATECLOSED,
      PercentageComplete: item.PercentageComplete,
      Cost: item.Cost,
      Catagory: item.Catagory,
      SubCatagory: item.SubCatagory,
      ProductionDate: item.ProductionDate,

    }
  })
  return formattedList;
}


export const getNumberOfJobs = async (filterParams) => {

  const whereClause = applyFilters(filterParams);
  const numberOfCustomers = await tblJobs.count({
    where: whereClause
  });
  return numberOfCustomers;
}

export const JobExistByID = async (id: number | string) => {
  const tableDetail = await tblJobs.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const getJobDetail = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  return tableDetail
}

export const getAllJobDetail = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyCusFilters(filterParams);

  const list = await tblJobDetail.findAll({
    attributes: ['UniqueID', 'JobID', 'PartsList', 'Serial', 'ShipDate', 'SingleMaterialCost', 'dateEntered', 'ScheduledDate', 'SingleLaborCost'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
  });
  return list;
}

export const updateJob = async (id, reqData) => {
  await tblJobs.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteJob = async (id) => {
  await tblJobs.destroy({ where: { UniqueID: id } });
  return id;
}

export const createNewJob = async (data) => {
  const createReqData = {
    ...data,
  };
  const newCustomer = await tblJobs.create(createReqData);
  return newCustomer
}


export const getJobCategories = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('Catagory')), 'Catagory']
    ],
    where: {
      [Op.and]: [
        { 'Catagory': { [Op.ne]: null } },
        { 'Catagory': { [Op.ne]: '' } }
      ]
    },
    order: [['Catagory', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item['Catagory']);
  return distinctCategories;
}

export const getJobSubCategories = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SubCatagory')), 'SubCatagory']
    ],
    where: {
      [Op.and]: [
        { 'SubCatagory': { [Op.ne]: null } },
        { 'SubCatagory': { [Op.ne]: '' } }
      ]
    },
    order: [['SubCatagory', 'ASC']],
    raw: true
  });

  const distinctSubCategories = result.map((item: any) => item['SubCatagory']);
  return distinctSubCategories;
}

export const getClosesByUsers = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ClosedBy')), 'ClosedBy']
    ],
    where: {
      [Op.and]: [
        { 'ClosedBy': { [Op.ne]: null } },
        { 'ClosedBy': { [Op.ne]: '' } }
      ]
    },
    order: [['ClosedBy', 'ASC']],
    raw: true
  });

  const distinctClosedByUsers = result.map((item: any) => item['ClosedBy']);
  return distinctClosedByUsers;
}

export const getJobTypes = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('JobType')), 'JobType']
    ],
    where: {
      [Op.and]: [
        { 'JobType': { [Op.ne]: null } },
        { 'JobType': { [Op.ne]: '' } }
      ]
    },
    order: [['JobType', 'ASC']],
    raw: true
  });

  const distinctJobType = result.map((item: any) => item['JobType']);
  return distinctJobType;
}

export const getPerType = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PerType')), 'PerType']
    ],
    where: {
      [Op.and]: [
        { 'PerType': { [Op.ne]: null } },
        { 'PerType': { [Op.ne]: '' } }
      ]
    },
    order: [['PerType', 'ASC']],
    raw: true
  });

  const distinctPerType = result.map((item: any) => item['PerType']);
  return distinctPerType;
}

export const getProductionUsers = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ProductionBy')), 'ProductionBy']
    ],
    where: {
      [Op.and]: [
        { 'ProductionBy': { [Op.ne]: null } },
        { 'ProductionBy': { [Op.ne]: '' } }
      ]
    },
    order: [['ProductionBy', 'ASC']],
    raw: true
  });

  const distinctProductionBy = result.map((item: any) => item['ProductionBy']);
  return distinctProductionBy;
}

export const getEmployees = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ByEmployee')), 'ByEmployee']
    ],
    where: {
      [Op.and]: [
        { 'ByEmployee': { [Op.ne]: null } },
        { 'ByEmployee': { [Op.ne]: '' } }
      ]
    },
    order: [['ByEmployee', 'ASC']],
    raw: true
  });

  const distinctByEmployees = result.map((item: any) => item['ByEmployee']);
  return distinctByEmployees;
}

export const getProductLines = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { 'PRODUCTLINE': { [Op.ne]: null } },
        { 'PRODUCTLINE': { [Op.ne]: '' } }
      ]
    },
    order: [['PRODUCTLINE', 'ASC']],
    raw: true
  });

  const distinctPRODUCTLINE = result.map((item: any) => item['PRODUCTLINE']);
  return distinctPRODUCTLINE;
}

export const getJobCat = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('jobcat')), 'jobcat']
    ],
    where: {
      [Op.and]: [
        { 'jobcat': { [Op.ne]: null } },
        { 'jobcat': { [Op.ne]: '' } }
      ]
    },
    order: [['jobcat', 'ASC']],
    raw: true
  });

  const distinctjobcat = result.map((item: any) => item['jobcat']);
  return distinctjobcat;
}

export const getJobSubCat = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('jobsubcat')), 'jobsubcat']
    ],
    where: {
      [Op.and]: [
        { 'jobsubcat': { [Op.ne]: null } },
        { 'jobsubcat': { [Op.ne]: '' } }
      ]
    },
    order: [['jobsubcat', 'ASC']],
    raw: true
  });

  const distinctjobsubcat = result.map((item: any) => item['jobsubcat']);
  return distinctjobsubcat;
}

export const getModels = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('MODEL')), 'MODEL']
    ],
    where: {
      [Op.and]: [
        { 'MODEL': { [Op.ne]: null } },
        { 'MODEL': { [Op.ne]: '' } }
      ]
    },
    order: [['MODEL', 'ASC']],
    raw: true
  });

  const distinctMODEL = result.map((item: any) => item['MODEL']);
  return distinctMODEL;
}