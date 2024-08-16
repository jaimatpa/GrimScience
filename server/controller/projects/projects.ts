import Op from "sequelize/lib/operators";
import Sequelize from "sequelize/lib/sequelize";
import tbl from "~/server/api/tbl";
import { tblBP, tblEmployee } from "~/server/models";
import tblJobs from "~/server/models/tblJobs";

const applyFilters = (params) => {
  console.log("Received params:", params);
  
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

  // Update this to use 'selectedOptions' if that's the key you're filtering by
  if (params.selectedOptions) {
    whereClause['Catagory'] = {
      [Op.like]: `%${params.selectedOptions}%`  // Adjust the field if needed
    };
  }

  return whereClause;
};

export const getAllProject = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  try {
    const limit = parseInt(pageSize, 10) || 10;
    const offset = ((parseInt(page, 10) - 1) || 0) * limit;
    
    const whereClause = applyFilters(filterParams);
    console.log("Generated whereClause:", whereClause);

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
};
export const getEmployeess = async () => {
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



export const getDistinctSubcategories = async (partTypeValue) => {
  try {
    const subcategories = await tblBP.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('subcategory')), 'subcategory']
      ],
      where: {
        uniqueid: {
          [Op.in]: Sequelize.literal(`(
            SELECT MAX(uniqueID)
            FROM tblBP
            GROUP BY instanceID
          )`)
        },
        parttype: partTypeValue // Ensure this field name is correct
      },
      order: [['subcategory', 'ASC']]
    });

    return subcategories.map(subcategory => subcategory.get('subcategory')); // Use `get` method to retrieve value
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};


export async function getBasicModels(parttype, subCategory) {
  try {
    const results = await tblBP.findAll({
      attributes: ['description'],
      where: {
        parttype: parttype,
        SubCategory: subCategory
      },
      order: [
        ['model', 'ASC'],
        ['description', 'ASC']
      ]
    });

    return results.map(result => result.get('description'));
  } catch (error) {
    console.error('Error executing basic query:', error);
  }
}




export const getProjectItem = async (Category) => {
  try {
    // Create the whereClause based on the category parameter
    const whereClause = Category ? { Category: Category } : {};

    const list = await tblJobs.findAll({
      attributes: ['Part'],
      where: whereClause
    });

    // Map the results to return only the 'Part' attribute
    return list.map(result => result.get('Part'));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('An error occurred while fetching the jobs.');
  }
}


export const createProject = async (data) => {
  const fullname = `${data.lname}, ${data.fname}`
  
  const newJob = await tblJobs.create(data);
  return newJob;
}





export const projectExistByID = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const getprojectDetail = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  return tableDetail
}


export const updateProject = async (id, reqData) => {
  await tblJobs.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}