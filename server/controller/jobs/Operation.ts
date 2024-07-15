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
    attributes: ['UniqueID', 'JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
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