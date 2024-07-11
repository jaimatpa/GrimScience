import { tblEmployee, tblJobOperations, tblOperationHoursWorked } from "~/server/models";
import { Sequelize, Op } from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled','OperationID'];
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

export const getAllOperation = async (page, pageSize, sortBy, sortOrder, filterParams) => {


  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblJobOperations.findAll({
    attributes: ['UniqueID', 'JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

tblOperationHoursWorked.belongsTo(tblEmployee, { foreignKey: 'EmployeeID', targetKey: 'UniqueID' });

export const getEmployeeSchedules = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize, 10) || 10;
  const offset = ((parseInt(page, 10) - 1) || 0) * limit;

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
    offset,
    limit
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