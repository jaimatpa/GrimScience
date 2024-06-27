import { tblEmployee } from "~/server/models";
import { Sequelize ,Op} from "sequelize";

const applyFilters = (params) => {
  const filterParams = ['ACTIVE','payrollno', 'fname', 'lname','address','city', 'state', 'zip', 'homephone'];  
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


export const getEmployeeFullNames = async () => {
  try {
    const list = await tblEmployee.findAll({
      attributes: [
        [Sequelize.literal("CONCAT(fname, ' ', lname)"), 'fullName'],
      ],
      where: {
        ACTIVE: true
      }
    });
    return list.map(employee => employee.get('fullName'));
  } catch(err) {
    return err.message;
  }
};

export const getAllEmployees = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblEmployee.findAll({
    attributes: ['ACTIVE','UniqueID','payrollno', 'fname', 'lname','address','city', 'state', 'zip', 'homephone'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getNumberOfEmplyees = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfCustomers = await tblEmployee.count({
    where: whereClause
  });
  return numberOfCustomers;
}


export const createEmployee = async (data) => {
  const createReqData = {
    ...data,
  };
  const newCustomer = await tblEmployee.create(createReqData);
  return newCustomer
}

export const EmployeeExistByID = async (id: number | string) => {
  const tableDetail = await tblEmployee.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const getEmployeeDetail = async (id) => {
  const tableDetail = await tblEmployee.findByPk(id);
  return tableDetail
}

export const updateEmployee = async (id, reqData) => {
  let updatedReqData
  if (typeof reqData.adddate === 'string'){
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`,
      adddate: Sequelize.literal(`CAST('${reqData.adddate}' AS DATETIME)`)
    };
  } else {
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`
    };
  }
  await tblEmployee.update(updatedReqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteEmployee = async (id) => {
  await tblEmployee.destroy({where: { UniqueID: id }});
  return id;
}