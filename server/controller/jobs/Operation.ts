import { tblEmployee, tblJobOperations, tblOperationHoursWorked } from "~/server/models";
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled', 'OperationID'];
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

export const getAllOperation = async (sortBy, sortOrder, filterParams) => {

  const whereClause = applyFilters(filterParams);

  const list = await tblJobOperations.findAll({
    attributes: ['UniqueID', 'Number', 'JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled'],
    where: whereClause,
    order: [[sortBy as string || 'Number', sortOrder as string || 'ASC']],
  });
  return list;
}

tblOperationHoursWorked.belongsTo(tblEmployee, { foreignKey: 'EmployeeID', targetKey: 'UniqueID' });

export const getEmployeeSchedules = async (sortBy, sortOrder, filterParams) => {

  const whereClause = applyFilters(filterParams);

  const list = await tblOperationHoursWorked.findAll({
    attributes: [
      'UniqueID',
      'JobID',
      'OperationID',
      'StartTime',
      'Hours',
      'StartTime'
    ],
    include: [
      {
        model: tblEmployee,
        attributes: ['UniqueID', 'payrollnumber', 'fname', 'lname'],
      }
    ],
    where: whereClause,
    order: [[sortBy || 'UniqueID', sortOrder || 'ASC']],
  });

  const formattedList = list.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      JobID: item.JobID,
      OperationID: item.OperationID,
      StartTime: item.StartTime,
      Hours: item.Hours,
      employee: `#${item.tblEmployee.payrollnumber} ${item.tblEmployee.fname} ${item.tblEmployee.lname}`
    }
  })

  return formattedList;
};

export const getEmployeeOperationSchedules = async (params) => {

  const { JobID, OperationID } = params
  let where = {}
  if (JobID) where['JobID'] = JobID
  if (OperationID) where['OperationID'] = OperationID

  const list = await tblOperationHoursWorked.findAll({
    attributes: [
      'UniqueID',
      'JobID',
      'OperationID',
      'StartTime',
      'Hours',
      'StartTime'
    ],
    include: [
      {
        model: tblEmployee,
        attributes: ['UniqueID', 'payrollnumber', 'fname', 'lname'],
      }
    ],
    where: where,
  });

  const formattedList = list.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      JobID: item.JobID,
      OperationID: item.OperationID,
      StartTime: item.StartTime,
      Hours: item.Hours,
      employee: `#${item.tblEmployee.payrollnumber} ${item.tblEmployee.fname} ${item.tblEmployee.lname}`
    }
  })

  return formattedList;
};

export const getJobOperationsById = async (params) => {
  const { JobID } = params
  let where = {}
  if (JobID) where['JobID'] = JobID
  const reports = await tblJobOperations.findAll({
    where: where,
    raw: true
  })
  return reports
}

export const OperationExistByID = async (id: number | string) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const deleteOperation = async (id) => {
  await tblJobOperations.destroy({ where: { UniqueID: id } });
  return id;
}

export const getJobOperationDetail = async (id) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  return tableDetail
}

export const updateJobOperation = async (id, reqData) => {
  await tblJobOperations.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const getWorkCenter = async () => {
  const result = await tblJobOperations.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('WorkCenter')), 'WorkCenter']
    ],
    where: {
      [Op.and]: [
        { 'WorkCenter': { [Op.ne]: null } },
        { 'WorkCenter': { [Op.ne]: '' } }
      ]
    },
    order: [['WorkCenter', 'ASC']],
    raw: true
  });

  const distinctWorkCenter = result.map((item: any) => item['WorkCenter']);
  return distinctWorkCenter;
}