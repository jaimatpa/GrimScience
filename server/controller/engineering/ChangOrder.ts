import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblCustomers, tblBP, tblECO } from "~/server/models";
import { tblEmployee } from "~/server/models";
import sequelize from "~/server/utils/databse";

const applyFilters = (params) => {
  const filterParams = [
    "uniqueID",
    "DESCRIPTION",
    "REASONFORCHANGE",
    "PRODUCT",
    "ORIGINATORDATE",
    "DISTRIBUTIONDATE",
    "APPROVAL"
  ];
  const whereClause = {};

  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`,
      };
    }
  });

  return whereClause;
};

export const getChangeOrders = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = (parseInt(page as string, 10) - 1 || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblECO.findAll({
    where: {
      ...whereClause,
    },
    order: [[(sortBy as string) || "uniqueID", (sortOrder as string) || "DESC"]],
    offset,
    limit,
    raw: true,
  });
  console.log(list);
  return list;
};

export const getNumberOfChangeOrder = async (filterParams) => {
  const whereClauseDB = applyFilters(filterParams);
  const numberOfCustomers = await tblECO.count({
    where: whereClauseDB,
  });
  return numberOfCustomers;
};






export const getSignature = async () => {
  try {
    const signatures = await tblECO.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("SIGNATURE")), "SIGNATURE"],
      ],
    });
    const distinctSignatures = signatures.map((sig) => sig.SIGNATURE);

    return distinctSignatures;
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch employee signatures." };
  }
};

export const getEmployList = async () => {
  try {
    const employees = await tblEmployee.findAll({
      attributes: ["fname", "lname"],
      where: {
        Active: 1,
      },
      group: ["fname", "lname"],
      order: [
        ["lname", "ASC"],
        ["fname", "ASC"],
      ],
    });

    return employees.length ? employees : { error: "No employees found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch employees" };
  }
};

export const getAllChangeOrderData = async (sortBy, sortOrder, filterParams) => {

  let whereClause = {};
  let customerWhereClause = {};
  if (filterParams.COMPLAINTNUMBER)
    whereClause["COMPLAINTNUMBER"] = {
      [Op.like]: `%${filterParams.COMPLAINTNUMBER}%`,
    };

  if (filterParams.SERIALNO)
    whereClause["SERIALNO"] = { [Op.like]: `%${filterParams.SERIALNO}%` };
 if (filterParams.SERIALNO)
    whereClause["APPROVAL"] = { [Op.like]: `%${filterParams.APPROVAL}%` };

  if (filterParams.COMPLAINTDATE)
    whereClause[Op.and] = [
      Sequelize.where(
        Sequelize.fn("FORMAT", Sequelize.col("COMPLAINTDATE"), "MM/dd/yyyy"),
        {
          [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`),
        }
      ),
    ];
  if (filterParams.FAILINVEST)
    whereClause["FAILINVEST"] = { [Op.like]: `%${filterParams.FAILINVEST}%` };
  if (filterParams.company)
    customerWhereClause["company1"] = {
      [Op.like]: `%${filterParams.company}%`,
    };

  const list = await tblECO.findAll({
    attributes: [
      "DESCRIPTION",
      "REASONFORCHANGE",
      "PRODUCT",
      "uniqueID",
      "DISTRIBUTIONDATE",
      "ORIGINATORDATE",
    ],
    order: [
      [
        (sortBy as string) || "COMPLAINTNUMBER",
        (sortOrder as string) || "DESC",
      ],
    ],
    raw: true,
  });
  const formattedList = list.map((item: any) => {
    return {
      uniqueID: item.uniqueID,
      ORIGINATORDATE:item.ORIGINATORDATE,
      DESCRIPTION: item.DESCRIPTION,
      REASONFORCHANGE: item.REASONFORCHANGE,
      PRODUCT: item.PRODUCT,
      DISTRIBUTIONDATE: item.DISTRIBUTIONDATE,
    
    };
  });
  return formattedList;
};



export const getReasonForChangList = async () => {
  try {
    const reasons = await tblECO.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("reasonforchange")),
          "reasonforchange",
        ],
      ],
      order: [["reasonforchange", "ASC"]],
    });

    return reasons.length ? reasons : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" };
  }
};

export const getJobOperationsById = async (params) => {
  const { uniqID } = params;
  let where = {};
  if (uniqID) where["uniqueID"] = uniqID;
  const reports = await tblECO.findAll({
    where: where,
    raw: true,
  });
  return reports;
};

// export const getChangeOrderDetail = async (id) => {
//   try {
//     const detail = await tblECO.findByPk(id, {
//       attributes: [
//         'uniqueID',
//         'DESCRIPTION',
//         'REASONFORCHANGE',
//         'DISTRIBUTIONDATE',
//       ]
//     });

//     if (!detail) {
//       throw new Error('Change order not found');
//     }
//     return detail;

//   } catch (error) {
//     console.error('Error fetching change order detail:', error);
//     throw error;
//   }
// };

// export const insertChangeOrderData = async (data) => {
//   debugger
//   const generateInsertQuery = (tableName, data) => {
//     const columns = Object.keys(data).join(", ");
//     const values = Object.values(data)
//       .map(value => typeof value === 'string' ? `'${value}'` : value)
//       .join(", ");

//     return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
//   };

//   const query = generateInsertQuery('tblECO', data);

//   try {
//     const [newCustomer] = await sequelize.query(query, { type: QueryTypes.INSERT });
//     console.log(newCustomer);
//     return newCustomer;
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     throw error;
//   }
// };

// const formatToSQLDateTimeObject = (date) => {
//   if (!date) return null;
//   const d = new Date(date);
//   const pad = (n) => (n < 10 ? '0' + n : n);

//   return {
//     year: d.getFullYear(),
//     month: pad(d.getMonth() + 1),
//     day: pad(d.getDate()),
//     time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.000`,
//   };
// };





// export const updateChangeOrderData = async (body) => {
//   const { uniqueID, ENGDATEAPPROVED, MARDATEAPPROVED, MANDATEAPPROVED, ...updatedData } = body;

//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "" || dateString === null) {
//       return null; 
//     }
    
//     const date = new Date(dateString);
//     const year = date.getUTCFullYear();
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(date.getUTCDate()).padStart(2, '0');
//     const hours = String(date.getUTCHours()).padStart(2, '0');
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   };

//   const finalUpdatedData = {
//     ...updatedData,
//     ENGDATEAPPROVED: formatDate(ENGDATEAPPROVED),
//     MARDATEAPPROVED: formatDate(MARDATEAPPROVED),
//     MANDATEAPPROVED: formatDate(MANDATEAPPROVED),
//   };

//   try {
//     const existingRecord = await tblECO.findOne({ where: { uniqueID } });
    
//     if (existingRecord) {
//       await existingRecord.update(finalUpdatedData);
//       return {
//         success: true,
//         message: "Record updated successfully",
//         data: existingRecord,
//       };
//     } else {
//       const newRecord = await tblECO.create(finalUpdatedData);
//       return {
//         success: true,
//         message: "Record created successfully",
//         data: newRecord,
//       };
//     }
//   } catch (error) {
//     console.error("Error in updateChangeOrderData:", error);
//     return {
//       success: false,
//       message: "Error processing request",
//       error: error.message,
//     };
//   }
// };

export const updateChangeOrderData = async (body) => {
  const {
    uniqueID,
    ENGDATEAPPROVED,
    MARDATEAPPROVED,
    MANDATEAPPROVED,
    DESCRIPTION,
    REASONFORCHANGE,
    PRODUCT,
    PRODUCTS,
    SOLUTION,
    DetailReason,
    FromModel,
    ToModel,
    PARTS,
    ISSUE,
    VandVNotRequired,
    ORIGINATOR,
    ORIGINATORDATE,
    ENGINEERING,
    ENGAPPROVER,
    ENGAPPROVAL,
    ENGCOMMENTS,
    MARKETING,
    MARAPPROVER,
    MARAPPROVAL,
    MARCOMMENTS,
    MANUFACTURING,
    MANAPPROVER,
    MANAPPROVAL,
    MANCOMMENTS,
    SIGNATURE,
    DISTRIBUTIONDATE,
    APPROVAL,
    COMMENTS,
  } = body;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === null) {
      return null; 
    }
    
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  const finalData = {
    ENGDATEAPPROVED: formatDate(ENGDATEAPPROVED),
    MARDATEAPPROVED: formatDate(MARDATEAPPROVED),
    MANDATEAPPROVED: formatDate(MANDATEAPPROVED),
    DESCRIPTION,
    REASONFORCHANGE,
    PRODUCT,
    PRODUCTS,
    SOLUTION,
    DetailReason,
    FromModel,
    ToModel,
    PARTS,
    ISSUE,
    VandVNotRequired,
    ORIGINATOR,
    ORIGINATORDATE,
    ENGINEERING,
    ENGAPPROVER,
    ENGAPPROVAL,
    ENGCOMMENTS,
    MARKETING,
    MARAPPROVER,
    MARAPPROVAL,
    MARCOMMENTS,
    MANUFACTURING,
    MANAPPROVER,
    MANAPPROVAL,
    MANCOMMENTS,
    SIGNATURE,
    DISTRIBUTIONDATE,
    APPROVAL,
    COMMENTS,
  };

  try {
    const [[{ count }]] = await sequelize.query(`SELECT COUNT(*) as count FROM tblECO WHERE uniqueID = :uniqueID`, {
      replacements: { uniqueID },
    });

    const query = count > 0 ? 
      `UPDATE tblECO SET ${Object.keys(finalData).map(key => `${key} = :${key}`).join(', ')} WHERE uniqueID = :uniqueID` :
      `INSERT INTO tblECO (${Object.keys(finalData).join(', ')}) VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;

    await sequelize.query(query, {
      replacements: { ...finalData, uniqueID },
    });

    return {
      success: true,
      message: count > 0 ? "Record updated successfully" : "Record created successfully",
      data: finalData,
    };
  } catch (error) {
    console.error("Error in updateChangeOrderData:", error);
    return {
      success: false,
      message: "Error processing request",
      error: error.message,
    };
  }
};


// export const updateChangeOrderData = async (body) => {

//   const {
//     uniqueID,
//     ENGDATEAPPROVED,
//     MARDATEAPPROVED,
//     MANDATEAPPROVED,
//     DESCRIPTION,
//     REASONFORCHANGE,
//     PRODUCT,
//     PRODUCTS,
//     SOLUTION,
//     DetailReason,
//     FromModel,
//     ToModel,
//     PARTS,
//     ISSUE,
//     VandVNotRequired,
//     ORIGINATOR,
//     ORIGINATORDATE,
//     ENGINEERING,
//     ENGAPPROVER,
//     ENGAPPROVAL,
//     ENGCOMMENTS,
//     MARKETING,
//     MARAPPROVER,
//     MARAPPROVAL,
//     MARCOMMENTS,
//     MANUFACTURING,
//     MANAPPROVER,
//     MANAPPROVAL,
//     MANCOMMENTS,
//     SIGNATURE,
//     DISTRIBUTIONDATE,
//     APPROVAL,
//     COMMENTS,
//   } = body;
  
//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "" || dateString === null) {
//       return null; 
//     }
    
//     const date = new Date(dateString);
//     const year = date.getUTCFullYear();
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(date.getUTCDate()).padStart(2, '0');
//     const hours = String(date.getUTCHours()).padStart(2, '0');
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   };

//   const finalUpdatedData = {
//     ENGDATEAPPROVED: formatDate(ENGDATEAPPROVED),
//     MARDATEAPPROVED: formatDate(MARDATEAPPROVED),
//     MANDATEAPPROVED: formatDate(MANDATEAPPROVED),
//   };
  
//   try {
//     const queryCheck = `
//       SELECT COUNT(*) as count FROM tblECO WHERE uniqueID = :uniqueID
//     `;

//     const [result] = await sequelize.query(queryCheck, {
//       replacements: { uniqueID },
//     });

//     const recordExists = result[0].count > 0;

//     if (recordExists) {
//       const queryUpdate = `
//         UPDATE tblECO
//         SET
//           ENGDATEAPPROVED = :engDateApproved,
//           MARDATEAPPROVED = :marDateApproved,
//           MANDATEAPPROVED = :mandateApproved,
//           DESCRIPTION = :descriptionData,
//           REASONFORCHANGE = :reasonForChange,
//           PRODUCT = :product,
//           PRODUCTS = :products,
//           SOLUTION = :solution,
//           DetailReason = :detailReason,
//           FromModel = :fromModel,
//           ToModel = :toModel,
//           PARTS = :parts,
//           ISSUE = :issue,
//           VandVNotRequired = :vandVNotRequired,
//           ORIGINATOR = :originator,
//           ORIGINATORDATE = :originatorDate,
//           ENGINEERING = :engineering,
//           ENGAPPROVER = :engApprover,
//           ENGAPPROVAL = :engApproval,
//           ENGCOMMENTS = :engComments,
//           MARKETING = :marketing,
//           MARAPPROVER = :marApprover,
//           MARAPPROVAL = :marApproval,
//           MARCOMMENTS = :marComments,
//           MANUFACTURING = :manufacturing,
//           MANAPPROVER = :manApprover,
//           MANAPPROVAL = :manApproval,
//           MANCOMMENTS = :manComments,
//           SIGNATURE = :signature,
//           DISTRIBUTIONDATE = :distributionDate,
//           APPROVAL = :approval,
//           COMMENTS = :comments
//         WHERE uniqueID = :uniqueID
//       `;

      
//       await sequelize.query(queryUpdate, {
//         replacements: {
//           engDateApproved: finalUpdatedData.ENGDATEAPPROVED,
//           marDateApproved: finalUpdatedData.MARDATEAPPROVED,
//           mandateApproved: finalUpdatedData.MANDATEAPPROVED,
//           descriptionData: DESCRIPTION,
//           reasonForChange: REASONFORCHANGE,
//           product: PRODUCT,
//           products: PRODUCTS,
//           solution: SOLUTION,
//           detailReason: DetailReason,
//           fromModel: FromModel,
//           toModel: ToModel,
//           parts: PARTS,
//           issue: ISSUE,
//           vandVNotRequired: VandVNotRequired,
//           originator: ORIGINATOR,
//           originatorDate: ORIGINATORDATE,
//           engineering: ENGINEERING,
//           engApprover: ENGAPPROVER,
//           engApproval: ENGAPPROVAL,
//           engComments: ENGCOMMENTS,
//           marketing: MARKETING,
//           marApprover: MARAPPROVER,
//           marApproval: MARAPPROVAL,
//           marComments: MARCOMMENTS,
//           manufacturing: MANUFACTURING,
//           manApprover: MANAPPROVER,
//           manApproval: MANAPPROVAL,
//           manComments: MANCOMMENTS,
//           signature: SIGNATURE,
//           distributionDate: DISTRIBUTIONDATE,
//           approval: APPROVAL,
//           comments: COMMENTS,
//           uniqueID: uniqueID,
//         },
//       });

//       return {
//         success: true,
//         message: "Record updated successfully",
//         data: finalUpdatedData,
//       };
//     } else {
//       const queryInsert = `
//         INSERT INTO tblECO (
//           ENGDATEAPPROVED,
//           MARDATEAPPROVED,
//           MANDATEAPPROVED,
//           DESCRIPTION,
//           REASONFORCHANGE,
//           PRODUCT,
//           PRODUCTS,
//           SOLUTION,
//           DetailReason,
//           FromModel,
//           ToModel,
//           PARTS,
//           ISSUE,
//           VandVNotRequired,
//           ORIGINATOR,
//           ORIGINATORDATE,
//           ENGINEERING,
//           ENGAPPROVER,
//           ENGAPPROVAL,
//           ENGCOMMENTS,
//           MARKETING,
//           MARAPPROVER,
//           MARAPPROVAL,
//           MARCOMMENTS,
//           MANUFACTURING,
//           MANAPPROVER,
//           MANAPPROVAL,
//           MANCOMMENTS,
//           SIGNATURE,
//           DISTRIBUTIONDATE,
//           APPROVAL,
//           COMMENTS
//         ) 
//         VALUES (
//           :engDateApproved,
//           :marDateApproved,
//           :mandateApproved,
//           :descriptionData,
//           :reasonForChange,
//           :product,
//           :products,
//           :solution,
//           :detailReason,
//           :fromModel,
//           :toModel,
//           :parts,
//           :issue,
//           :vandVNotRequired,
//           :originator,
//           :originatorDate,
//           :engineering,
//           :engApprover,
//           :engApproval,
//           :engComments,
//           :marketing,
//           :marApprover,
//           :marApproval,
//           :marComments,
//           :manufacturing,
//           :manApprover,
//           :manApproval,
//           :manComments,
//           :signature,
//           :distributionDate,
//           :approval,
//           :comments
//         )
//       `;

//       await sequelize.query(queryInsert, {
//         replacements: {
//           engDateApproved: finalUpdatedData.ENGDATEAPPROVED,
//           marDateApproved: finalUpdatedData.MARDATEAPPROVED,
//           mandateApproved: finalUpdatedData.MANDATEAPPROVED,
//           descriptionData: DESCRIPTION,
//           reasonForChange: REASONFORCHANGE,
//           product: PRODUCT,
//           products: PRODUCTS,
//           solution: SOLUTION,
//           detailReason: DetailReason,
//           fromModel: FromModel,
//           toModel: ToModel,
//           parts: PARTS,
//           issue: ISSUE,
//           vandVNotRequired: VandVNotRequired,
//           originator: ORIGINATOR,
//           originatorDate: ORIGINATORDATE,
//           engineering: ENGINEERING,
//           engApprover: ENGAPPROVER,
//           engApproval: ENGAPPROVAL,
//           engComments: ENGCOMMENTS,
//           marketing: MARKETING,
//           marApprover: MARAPPROVER,
//           marApproval: MARAPPROVAL,
//           marComments: MARCOMMENTS,
//           manufacturing: MANUFACTURING,
//           manApprover: MANAPPROVER,
//           manApproval: MANAPPROVAL,
//           manComments: MANCOMMENTS,
//           signature: SIGNATURE,
//           distributionDate: DISTRIBUTIONDATE,
//           approval: APPROVAL,
//           comments: COMMENTS,
//         },
//       });
//       console.log(finalUpdatedData)
      
//       return {
//         success: true,
//         message: "Record created successfully",
//         data: finalUpdatedData,
      
//       };
     
//     }
  
//   } catch (error) {
//     console.error("Error in upsertChangeOrderData:", error);
//     return {
//       success: false,
//       message: "Error processing request",
//       error: error.message,
//     };
//   }
// };
