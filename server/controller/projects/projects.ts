import Op from "sequelize/lib/operators";
import { tblEmployee } from "~/server/models";
import tblJobs from "~/server/models/tblJobs";

// Function to apply filters based on the parameters
const applyFilters = (params) => {
  console.log("param is", params);
  const filterParams = [
    'UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PerType', 'DATEOPENED', 
  'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 
  'Cost', 'jobcat', 'jobsubcat', 'ProductionDate', 'projectType'
  ];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  if (params.selectedProjectTypes && params.selectedProjectTypes.length > 0) {
    whereClause['projectType'] = {
      [Op.in]: params.selectedProjectTypes
    };
  }

  return whereClause;
};

export const getAllJobss = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  try {
    const limit = parseInt(pageSize, 10) || 10;
    const offset = ((parseInt(page, 10) - 1) || 0) * limit;
    
    const whereClause = applyFilters(filterParams);
    console.log("whereClause", whereClause);

    const list = await tblJobs.findAll({
      attributes: [
       'UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PerType', 'DATEOPENED', 
  'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 
  'Cost', 'jobcat', 'jobsubcat', 'ProductionDate', 'projectType'
      ],
      where: whereClause,
      order: [[sortBy || 'UniqueID', sortOrder || 'ASC']],
      offset,
      limit
    });

    return list;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}
export const getEmployeess = async()=>{

  const employeess = await tblEmployee.findAll({
    attributes: [
      'UniqueID', 'fName', 'lName'
     ],
    raw: true // Return plain data objects
  });

return employeess;
}
