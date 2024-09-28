
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { tblCustomers,tblBP, tblECO} from "~/server/models";
import { tblEmployee} from "~/server/models";
import sequelize from '~/server/utils/databse';

const applyFilters = (params) => {
  const filterParams = ['ACTIVE', 'DESCRIPTION', 'REASONFORCHANGE', 'PRODUCT', 'uniqueID', 'DISTRIBUTIONDATE'];
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

export const getChangeOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblECO.findAll({ 
    where: {
      ...whereClause
    },
     order: [[sortBy as string || 'PRODUCT', sortOrder as string || 'DESC']],
    offset,
    limit,
    raw: true
  });
  console.log(list)
  return list

};

export const getNumberOfChangeOrder = async (filterParams) => {
  const whereClauseDB = applyFilters(filterParams);
  const numberOfCustomers = await tblECO.count({
    where: whereClauseDB
  });
  return numberOfCustomers;
}


export const getSignature = async () => {
  try {
    const signatures = await tblECO.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('SIGNATURE')), 'SIGNATURE']],
    });
    const distinctSignatures = signatures.map(sig => sig.SIGNATURE);
    
    return distinctSignatures; 

  } catch (error) {
    console.error('Database error:', error);
    return { error: error.message || 'Failed to fetch employee signatures.' };
  }
};


export const getEmployList = async () => {
  try {
    const employees = await tblEmployee.findAll({
      attributes: [
        'fname',
        'lname',
      ],
      where: {
        Active: 1,
      },
      group: ['fname', 'lname'],
      order: [
        ['lname', 'ASC'],
        ['fname', 'ASC'],
      ],
    });

    return employees.length ? employees : { error: 'No employees found' };
  } catch (error) {
    console.error('Database error:', error);
    return { error: error.message || 'Failed to fetch employees' };
  }
};


export const getReasonForChangList = async () => {
  try {
    const reasons = await tblECO.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('reasonforchange')), 'reasonforchange'], 
      ],
      order: [['reasonforchange', 'ASC']], 
    });

    return reasons.length ? reasons : { error: 'No reasons found' };
  } catch (error) {
    console.error('Database error:', error);
    return { error: error.message || 'Failed to fetch reasons for change' };
  }
};


export const getChangeOrderDetail = async (id) => {
  try {
    const detail = await tblECO.findByPk(id, {
      attributes: [
        'uniqueID',
        'DESCRIPTION',
        'REASONFORCHANGE',
        'DISTRIBUTIONDATE',
      ]
    });


    if (!detail) {
      throw new Error('Change order not found');
    }
    return detail;


  } catch (error) {
    console.error('Error fetching change order detail:', error);
    throw error;
  }
};



export const insertChangeOrderData = async (data) => {
  const generateInsertQuery = (tableName, data) => {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map(value => typeof value === 'string' ? `'${value}'` : value)
      .join(", ");

    return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
  };

  const query = generateInsertQuery('tblECO', data);

  try {
    const [newCustomer] = await sequelize.query(query, { type: QueryTypes.INSERT });
    console.log(newCustomer);
    return newCustomer;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
};


export const updateChangeOrderData = async (body) => {
  const { uniqueID, ...updatedData } = body;
  try {
    const existingRecord = await tblECO.findOne({ where: { uniqueID } });

    if (existingRecord) {
      await existingRecord.update(updatedData);
      return {
        success: true,
        message: 'Record updated successfully',
        data: existingRecord,
      };
    } else {
      const newRecord = await tblECO.create(updatedData);
      return {
        success: true,
        message: 'Record created successfully',
        data: newRecord,
      };
    }
  } catch (error) {
    console.error('Error in updateChangeOrderData:', error);
    return {
      success: false,
      message: 'Error processing request',
      error: error.message,
    };
  }
};
