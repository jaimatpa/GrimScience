
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { tblCustomers,tblBP, tblECO} from "~/server/models";
import { tblEmployee} from "~/server/models";
import sequelize from '~/server/utils/databse';


export const getChangeOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
 
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  let whereClause = {};
  let customerWhereClause = {};

  if (filterParams.DESCRIPTION) whereClause['DESCRIPTION'] = { [Op.like]: `%${filterParams.DESCRIPTION}%` };
  if (filterParams.PRODUCT) whereClause['PRODUCT'] = { [Op.like]: `%${filterParams.PRODUCT}%` };
  if (filterParams.REASONFORCHANGE) whereClause['REASONFORCHANGE'] = { [Op.like]: `%${filterParams.REASONFORCHANGE}%` };
  if (filterParams.uniqueID) whereClause['uniqueID'] = { [Op.like]: `%${filterParams.uniqueID}%` };

  if (filterParams.DISTRIBUTIONDATE) {
    whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('DISTRIBUTIONDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.DISTRIBUTIONDATE}%'`)
      })
    ];
  }
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


// export const getChangeOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
 
//   const limit = parseInt(pageSize as string, 10) || 10;
//   const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
//   let whereClause = {};
//   let customerWhereClause = {};

//   if (filterParams.DESCRIPTION) whereClause['DESCRIPTION'] = { [Op.like]: `%${filterParams.DESCRIPTION}%` };
//   if (filterParams.PRODUCT) whereClause['PRODUCT'] = { [Op.like]: `%${filterParams.PRODUCT}%` };
//   if (filterParams.REASONFORCHANGE) whereClause['REASONFORCHANGE'] = { [Op.like]: `%${filterParams.REASONFORCHANGE}%` };
//   if (filterParams.uniqueID) whereClause['uniqueID'] = { [Op.like]: `%${filterParams.uniqueID}%` };

//   if (filterParams.DISTRIBUTIONDATE) {
//     whereClause[Op.and] = [
//       Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('DISTRIBUTIONDATE'), 'MM/dd/yyyy'), {
//         [Op.like]: Sequelize.literal(`'%${filterParams.DISTRIBUTIONDATE}%'`)
//       })
//     ];
//   }
//   tblECO.hasOne(tblBP, { foreignKey: 'PRODUCTLINE', sourceKey: 'PRODUCT' });
//   const list = await tblECO.findAll({
//     attributes: [
//       // 'NUMBER',
//       'uniqueID',
//       'DESCRIPTION',
//       'REASONFORCHANGE',
//       'DISTRIBUTIONDATE',
//       [Sequelize.col('tblBP.PRODUCTLINE'), 'PRODUCTLINE'],
//       [Sequelize.col('tblBP.uniqueID'), 'PRODUCT']
//     ],
//     include: [
//       {
//         model: tblBP,
//         attributes: ['uniqueID', 'PRODUCTLINE'],
//         where: customerWhereClause
//       }
//     ],
//     where: {
//       ...whereClause
//     },
//      order: [[sortBy as string || 'PRODUCT', sortOrder as string || 'DESC']],


//     offset,
//     limit,
//     raw: true
//   });


//   const formattedList = list.map((item: any) => {
//     let openCase = item.OPENCASE === '0' ? 'OPEN' : 'CLOSED';
//     let complaintDate;
//     if (item.DISTRIBUTIONDATE) {
//       complaintDate = new Date(item.DISTRIBUTIONDATE);
//       if (isNaN(complaintDate.getTime())) {
//         complaintDate = null;
//       }
//     }


//     let formattedDate = complaintDate
//       ? `${complaintDate.getMonth() + 1}/${complaintDate.getDate()}/${complaintDate.getFullYear()}`
//       : 'Invalid Date';
//     return {
//       NUMBER: item.uniqueID,
//       uniqueID: item.uniqueID,
//       DESCRIPTION: item.DESCRIPTION,
//       REASONFORCHANGE: item.REASONFORCHANGE,
//       DISTRIBUTIONDATE: item.DISTRIBUTIONDATE,
//       COMPLAINTDATE: formattedDate,
//       openCase,
//     };
//   });
 
//   return formattedList
 
// };

export const getSignature = async () => {
  try {
    const signatures = await tblECO.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('SIGNATURE')), 'SIGNATURE']],
    });
    const distinctSignatures = signatures.map(sig => sig.SIGNATURE);
    
    return distinctSignatures; // Return the array of distinct signatures

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
      group: ['fname', 'lname'], // Use group to get distinct values
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
      order: [['reasonforchange', 'ASC']], // Order by reasonforchange
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


// ok code
export const insertChangeOrderData = async (data) => {
  console.log(data);

  // Generate dynamic SQL insert query
  const generateInsertQuery = (tableName, data) => {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map(value => typeof value === 'string' ? `'${value}'` : value)
      .join(", ");

    return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
  };

  // Use the dynamically created query
  const query = generateInsertQuery('tblECO', data);

  try {
    // Execute the raw SQL query
    const [newCustomer] = await sequelize.query(query, { type: QueryTypes.INSERT });
    console.log(newCustomer);
    return newCustomer;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
};



// export const updateChangeOrderData = async (body) => {
  
//   const { uniqueID, ...updatedData } = body;
//   try {
//     const existingRecord = await tblECO.findOne({ where: { uniqueID } });
//     if (existingRecord) {
//       await existingRecord.update(updatedData);
//       return {
//         success: true,
//         message: 'Record updated successfully',
//         data: existingRecord,
//       };
//     } else {
      
//       const newRecord = await tblECO.create({ ...updatedData });
//       return {
//         success: true,
//         message: 'Record created successfully',
//         data: newRecord,
//       };
//     }
//   } catch (error) {
//     console.error('Error in updateChangeOrderData:', error);
//     return {
//       success: false,
//       message: 'Error processing request',
//       error: error.message,
//     };
//   }
// };




export const updateChangeOrderData = async (body) => {
  debugger
  const { uniqueID, ...updatedData } = body;

  try {
    // Check if the record with the given uniqueID exists
    const existingRecord = await tblECO.findOne({ where: { uniqueID } });

    if (existingRecord) {
      // Update the existing record with the provided data
      await existingRecord.update(updatedData);

      return {
        success: true,
        message: 'Record updated successfully',
        data: existingRecord,
      };
    } else {
      // If no record exists, create a new one (ensure uniqueID is handled correctly)
      const newRecordData = { uniqueID, ...updatedData };

      const newRecord = await tblECO.create(newRecordData);

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


// export const getChangeOrderDetail = async (id) => {
//   try {
//     const detail = await tblECO.findByPk(id, {
//       attributes: [
//         'uniqueID',
//         'DESCRIPTION',
//         'REASONFORCHANGE',
//         'DISTRIBUTIONDATE',
//       ],
//       include: [
//         {
//           model: tblEmployee, 
//           as: 'employee',      
//           attributes: ['fname', 'lname'], 
//         },
//       ],
//     });

//     if (!detail) {
//       throw new Error('Change order not found');
//     }

//     // Combine the employee's first and last name if they exist
//     const employeeFullName = detail.employee ? `${detail.employee.fname} ${detail.employee.lname}` : null;

//     return {
//       ...detail.toJSON(),  // Convert the Sequelize instance to a plain object
//       employeeFullName,    // Include the employee's full name in the returned result
//     };

//   } catch (error) {
//     console.error('Error fetching change order detail:', error);
//     throw error;
//   }
// };


// const convertToDate = (dateString) => {

//   if (!dateString) return null;

//   const date = new Date(dateString);
//   return isNaN(date) ? null : date; 
// };





// export const insertChangeOrderData = async (data) => {
// debugger
//   const convertToDate = (dateString) => {
//     if (!dateString) return null;
  
//     const date = new Date(dateString);
//     return isNaN(date) ? null : date; 
//   };
//   try {
  
//     const newChangeOrder = await tblECO.create({
//       PRODUCT: data.productLine,
//       DESCRIPTION: data.description,
//       SOLUTION: data.solutionOrder,
//       REASONFORCHANGE: data.changeReasonOption,
//       ISSUE: data.issueDetails,
//       DetailReason: data.DetailsReasonChange,
//       FromModel: data.fromModel,
//       ToModel: data.toModel,
//       PARTS: data.partsAffect,

//       // Approvers
//       ENGAPPROVER: data.approvals.engineering.employeeOptions,
//       MARAPPROVER: data.approvals.marketing.employeeOptions,
//       ORIGINATOR: data.approvals.originator.employeeOptions,
//       MANAPPROVER: data.approvals.manufacturing.employeeOptions,

//       // Approval Status
//       ENGAPPROVAL: data.approvals.engineering.approval,
//       MARAPPROVAL: data.approvals.marketing.approval,
//       MANAPPROVAL: data.approvals.manufacturing.approval,
//       ORIGINATORAPPROVAL: data.approvals.originator.approval,

//       // Approval Dates - Convert to Date objects
//       ENGDATEAPPROVED: convertToDate(data.approvals.engineering.dateOrder),
//       MARDATEAPPROVED: convertToDate(data.approvals.marketing.dateOrder),
//       MANDATEAPPROVED: convertToDate(data.approvals.manufacturing.dateOrder),
//       ORIGINATORDATE: convertToDate(data.approvals.originator.dateOrder),

//       // Complete Section
//       COMPLETEDATE: convertToDate(data.approvals.complete.dateOrder),
//       COMPLETEAPPROVAL: data.approvals.complete.approval,
//       COMPLETECOMMENTS: data.approvals.complete.comments,
//     });

//     return newChangeOrder;
//   } catch (error) {
//     console.error('Error inserting change order data:', error);
//     throw new Error(`Failed to insert change order: ${error.message}`);
//   }
// };
































// export const insertChangeOrderData = async (data) => {
//   debugger
//   try {
//     console.log(data); 

//     const newChangeOrder = await tblECO.create({
//       PRODUCT: data.productLine,
//       DESCRIPTION: data.description, 
//       SOLUTION: data.solutionOrder,
//       REASONFORCHANGE: data.changeReasonOption, 
//       ISSUE: data.issueDetails,
//       DetailReason: data.DetailsReasonChange,
//       FromModel: data.fromModel,
//       ToModel: data.toModel,
//       PARTS: data.partsAffect,

//       // Approvers
//       ENGAPPROVER: data.approvals.engineering.productLine,
//       MARAPPROVER: data.approvals.marketing.productLine,
//       ORIGINATOR: data.approvals.originator.productLine,
//       MANAPPROVER: data.approvals.manufacturing.productLine,

//       // Approval Status
//       ENGAPPROVAL: data.approvals.engineering.approval,
//       MARAPPROVAL: data.approvals.marketing.approval,
//       MANAPPROVAL: data.approvals.manufacturing.approval,
//       ORIGINATORAPPROVAL: data.approvals.originator.approval,

//       // Approval Dates
//       ENGDATEAPPROVED: data.approvals.engineering.date,
//       MARDATEAPPROVED: data.approvals.marketing.date,
//       MANDATEAPPROVED: data.approvals.manufacturing.date,
//       ORIGINATORDATE: data.approvals.originator.date,

//       // Complete Section (Optional or can be added if needed)
//       COMPLETEDATE: data.approvals.complete.date,
//       COMPLETEAPPROVAL: data.approvals.complete.approval,
//       COMPLETECOMMENTS: data.approvals.complete.comments,
//     });

//     return newChangeOrder; 
//   } catch (error) {
//     console.error('Error inserting change order data:', error);
//     throw new Error(`Failed to insert change order: ${error.message}`);
//   }
// };
