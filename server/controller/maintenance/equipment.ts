import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblCustomers, tblBP,tblMaintainenceOrders,tblWorkStation, tblECO } from "~/server/models";
import { tblEmployee } from "~/server/models";
import sequelize from "~/server/utils/databse";

const applyFilters = (params) => {
  const filterParams = [
    "MANO",
    "CATAGORY",
    "SUBCATAGORY",
    "PART",
    "SERIAL",
    "ORDEREDBY",
    "REQUIRED"

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

export const getEquipmentTableData= async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = (parseInt(page as string, 10) - 1 || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblMaintainenceOrders.findAll({
    where: {
      ...whereClause,
    },
    order: [[(sortBy as string) || "MANO", (sortOrder as string) || "ASC"]],
    offset,
    limit,
    raw: true,
  });
  console.log(list);
  return list;
};

export const getNumberOfEquipment= async (filterParams) => {
  const whereClauseDB = applyFilters(filterParams);
  const numberOfCustomers = await tblMaintainenceOrders.count({
    where: whereClauseDB,
  });
  return numberOfCustomers;
};


export const getAllCategoryList = async () => {
  try {
    const reasons = await tblBP.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("parttype")), "parttype"]
      ],
      order: [["parttype", "ASC"]],
      raw: true,
    });

    const categories = reasons.map(item => item.parttype);
   
    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" }; // Handle any errors
  }
};

export const getAllSubCategoryList = async () => {
  try {
    const reasons = await tblBP.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("subcategory")), "subcategory"]
      ],
      order: [["subcategory", "ASC"]],
      raw: true,
    });

    const categories = reasons.map(item => item.subcategory);

    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" }; 
  }
};

export const getAllEquipmentList = async () => {
  try {
    const reasons = await tblWorkStation.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("PART")), "PART"]
      ],
      order: [["PART", "ASC"]],
      raw: true,
    });

    const categories = reasons.map(item => item.PART);
    console.log("Extracted Categories:", categories);
    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" }; 
  }
};


// export const insertEquipmentData = async (body) => {
//   const {
//     uniqeId,
//     category,
//     subCategory,
//     equipment,
//     serialNo,
//     type,
//     location,
//     responsible,
//     dateInService,
//     nextReqService,
//   } = body;

//   // Date formatting function
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

//   const finalData = {
//     category,
//     subCategory,
//     equipment,
//     SERIALID: serialNo,
//     type,
//     location,
//     responsible,
//     InserviceDate: formatDate(dateInService),
//     nextReqService: formatDate(nextReqService),
//   };

//   try {
//     // Check if the record with the given UniqueID already exists
//     const existingRecord = await tblMaintainenceOrders.findOne({
//       where: { UniqueID: uniqeId }, // Check only based on UniqueID
//     });

//     if (existingRecord) {
//       // If record exists, update it
//       await tblMaintainenceOrders.update(finalData, {
//         where: { UniqueID: uniqeId },
//       });
//       console.log("Record updated with data:", finalData);

//       return {
//         success: true,
//         message: "Record updated successfully",
//         data: finalData,
//       };
//     } else {
//       // If no record exists, create a new one
//       const result = await sequelize.query(
//         `SELECT COALESCE(MAX(UniqueID), 0) + 1 AS maxUniqueID FROM tblMaintainenceOrders`,
//         {
//           type: sequelize.QueryTypes.SELECT,
//         }
//       );
//       const maxUniqueID = result[0] ? result[0].maxUniqueID : 1;
//       finalData.UniqueID = maxUniqueID; // Assign new UniqueID

//       const newRecord = await tblMaintainenceOrders.create(finalData);
//       console.log("New record created with data:", finalData);

//       return {
//         success: true,
//         message: "Record created successfully",
//         data: newRecord,
//       };
//     }
//   } catch (error) {
//     console.error("Error in insertEquipmentData:", error);
//     return {
//       success: false,
//       message: "Error processing request",
//       error: error.message,
//     };
//   }
// };

export const insertEquipmentData = async (body) => { 

  const formatDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === null) {
      return null; 
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // Return null if the date is invalid
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Return only date part
  };

  // Create a new object for the final data
  const finalData = {
    ...body,
    DATE: formatDate(body.DATE) || body.DATE, // Use formatted date or retain original
    REQUIRED: formatDate(body.REQUIRED) || body.REQUIRED, // Use formatted date or retain original
  };

  try {
    // Calculate the max number for MANO
    const result = await sequelize.query(`SELECT COALESCE(MAX(MANO), 0) + 1 AS maxNumber FROM tblMaintainenceOrders`, {
      type: sequelize.QueryTypes.SELECT,
    });
    finalData.MANO = result[0] ? result[0].maxNumber : 1; // Assign the calculated max number

    // Construct insert query
    const query = `INSERT INTO tblMaintainenceOrders (${Object.keys(finalData).join(', ')}) VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;

    // Execute the query
    await sequelize.query(query, {
      replacements: finalData,
    });

    return {
      success: true,
      message: "Record created successfully",
      data: finalData,
    };
  } catch (error) {
    console.error("Error in insertEquipmentData:", error);
    return {
      success: false,
      message: "Error processing request",
      error: error.message,
    };
  }
};



// export const insertEquipmentData = async (body) => {
//   const {
//     uniqeId,
//     category,
//     subCategory,
//     equipment,
//     serialNo,
//     type,
//     location,
//     responsible,
//     dateInService,
//     nextReqService
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

//   const finalData = {
//     uniqeId,
//     category,
//     subCategory,
//     equipment,
//     serialNo,
//     type,
//     location,
//     responsible,
//     dateInService: formatDate(dateInService),
//     nextReqService: formatDate(nextReqService)
//   };

//   try {
//     const [[{ count }]] = await sequelize.query(
//       `SELECT COUNT(*) as count FROM tblMaintainenceOrders WHERE SERIALID = :serialNo`, {
//       replacements: { serialNo },
//     });

//     if (count === 0) {
//       // If there's no existing record, create a new one and auto-increment the number
//       const result = await sequelize.query(`SELECT COALESCE(MAX(UniqueID), 0) + 1 AS maxUniqueID FROM tblMaintainenceOrders`, {
//         type: sequelize.QueryTypes.SELECT,
//       });
//       const maxUniqueID = result[0] ? result[0].maxUniqueID : 1;
//       finalData.UniqueID = maxUniqueID; 
//     }

//     const query = count > 0 
//       ? `UPDATE tblMaintainenceOrders SET ${Object.keys(finalData).map(key => `${key} = :${key}`).join(', ')} WHERE SERIALID = :serialNo`
//       : `INSERT INTO tblMaintainenceOrders (${Object.keys(finalData).join(', ')}) VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;

//     await sequelize.query(query, {
//       replacements: { ...finalData, serialNo },
//     });
// console.log(finalData)
//     return {
//       success: true,
//       message: count > 0 ? "Record updated successfully" : "Record created successfully",
//       data: finalData,
//     };
//   } catch (error) {
//     console.error("Error in insertEquipmentData:", error);
//     return {
//       success: false,
//       message: "Error processing request",
//       error: error.message,
//     };
//   }
// };

