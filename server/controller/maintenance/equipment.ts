import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblCustomers, tblBP,tblMaintainenceOrders,tblWorkStation,tblMaintainenceReports,tblMaintReportMeasurements } from "~/server/models";
import { tblEmployee } from "~/server/models";
import sequelize from "~/server/utils/databse";
// ok code
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

export const getPDFDataById = async (params) => {
  const { uniqID } = params;
  let where = {};
  if (uniqID) where["MANO"] = uniqID;
  const reports = await tblMaintainenceOrders.findAll({
    where: where,
    raw: true,
  });


  return reports;
};


// ok code
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

    order: [[(sortBy as string) || "UniqueID","DESC"]],
    offset,
    limit,
    raw: true,
  });
  console.log(list);
  return list;
};
// ok code
export const getNumberOfEquipment= async (filterParams) => {
  const whereClauseDB = applyFilters(filterParams);
  const numberOfCustomers = await tblMaintainenceOrders.count({
    where: whereClauseDB,
  });
  return numberOfCustomers;
};

// ok code
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
// ok code
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

// ok code
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
    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" }; 
  }
};

// ok code
export const getAllTypeList = async () => {
  try {
    const reasons = await tblMaintainenceOrders.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("TYPE")), "TYPE"]
      ],
      order: [["TYPE", "ASC"]],
      raw: true,
    });

    const categories = reasons.map(item => item.TYPE);
    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" }; 
  }
};

// ok code
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
    return `${year}-${month}-${day}`; 
  };
  const finalData = {
    ...body,
    DATE: formatDate(body.DATE) || body.DATE, 
    REQUIRED: formatDate(body.REQUIRED) || body.REQUIRED, 
  };

  try {
    // Calculate the max number for MANO
    const result = await sequelize.query(`SELECT COALESCE(MAX(MANO), 0) + 1 AS maxNumber FROM tblMaintainenceOrders`, {
      type: sequelize.QueryTypes.SELECT,
    });
    finalData.MANO = result[0] ? result[0].maxNumber : 1;

    // Construct insert query
    const query = `INSERT INTO tblMaintainenceOrders (${Object.keys(finalData).join(', ')}) VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;
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


// ok code
export const deleteEquipmentData = (id) => {
  if (!id) {
    throw new Error("ID is required for deletion.");
  }
  
  return sequelize.query(`DELETE FROM tblMaintainenceOrders WHERE UniqueID = :id`, {
    replacements: { id }, 
  });
};

// ok code
export const removeReportTableData = (id) => {
  if (!id) {
    throw new Error("ID is required for deletion.");
  }
  
  return sequelize.query(`DELETE FROM tblMaintainenceReports WHERE No = :id`, {
    replacements: { id }, 
  });
};


// ok code
export const getAllMatchReportData = async (orderId, query) => {
  try {
    
    const orderIdInt = parseInt(orderId, 10); 

    if (isNaN(orderIdInt)) {
      throw new Error('Invalid OrderID: must be a valid number');
    }

    const reports = await tblMaintainenceReports.findAll({
      where: {
        OrderID: orderIdInt 
      },
      attributes: ['uniqueid', 'No', 'date', 'by'],
      order: [['No', 'DESC']]
    });
    return reports;
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

// ok code
export const getAllReportByData = async () => {
  try {
    const reports = await tblMaintainenceReports.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('By')), 'By']], 
      order: [['By', 'DESC']], 
    });
    
    const uniqueReports = reports.map(report => report.get('By'));
    
    return uniqueReports; 
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};
// ok code
export const getAllReportWhereData = async () => {
  try {
    const reports = await tblMaintainenceReports.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Inhouse')), 'Inhouse']],
      order: [['Inhouse', 'DESC']], 
    });
    const uniqueReports = reports.map(report => report.get('Inhouse'));
    return uniqueReports; 
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};
// ok code
export const getAllReportSub1Data = async () => {
  try {
    const reports = await tblMaintainenceReports.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Sub1')), 'Sub1']], 
      order: [['Sub1', 'DESC']], 
    });
    
    const uniqueReports = reports.map(report => report.get('Sub1'));

    return uniqueReports; 
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

// ok code
export const getAllReportUOMData = async () => {
  try {
    const reports = await tblMaintReportMeasurements.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('UOM')), 'UOM']], 
      order: [['UOM', 'DESC']],
    });
    const uniqueReports = reports.map(report => report.get('UOM'));
    
   // Log the unique reports
    return uniqueReports; // Return the unique reports
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

// ok code
export const getAllReportSearchData = async (subCategory) => {

  try {
    const reports = await tblMaintainenceReports.findAll({
      where: {
        Sub1: subCategory, 
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Inst1')), 'Inst1']],
      order: [['Inst1', 'DESC']],
      group: ['Inst1'], 
    });
    
    const uniqueReports = reports.map(report => report.get('Inst1'));
    return uniqueReports;
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

// ok code
export const getReportInstrumentData = async (subCategory) => {

  try {
    const reports = await tblMaintainenceReports.findAll({
      where: {
        Inst1:subCategory, 
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('IC1')), 'IC1']],
      order: [['IC1', 'DESC']],
      group: ['IC1'], 
    });
    
    const uniqueReports = reports.map(report => report.get('IC1'));

    console.log(uniqueReports)
    return uniqueReports;
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};
 
// ok code
export const getAllEquipment= async (sortBy, sortOrder, filterParams) => {

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

  const list = await tblMaintainenceOrders.findAll({
    attributes: [
      "MANO",
      "CATAGORY",
      "SUBCATAGORY",
      "PART",
      "SERIAL",
   
    ],
    order: [
      [
        (sortBy as string) || "MANO",
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


// ok code
export const createNewReport = async (reportData) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === null) {
      return null; // Handle null or empty dates
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

  try {
    // Step 1: Get the current maximum value for the No column
    const result = await sequelize.query(
      `SELECT COALESCE(MAX(No), 0) + 1 AS maxNumber FROM tblMaintainenceReports`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const maxNumber = result[0] ? parseInt(result[0].maxNumber, 10) : 1; 
    const orderId = reportData.ReportID ? parseInt(reportData.ReportID, 10) : null; 
    const formattedDate = formatDate(reportData.reportCreateData);

    // Step 2: Build the INSERT statement dynamically
    const columns = ['No', 'OrderID', 'Date', '[By]', 'DESCRIPTION', 'Inhouse', 'Vendor', 'Sub1', 'Sub2', 'Sub3', 'Sub4', 'Inst1', 'Inst2', 'Inst3', 'Inst4', 'IC1', 'IC2', 'IC3', 'IC4'];
    const values = [
      maxNumber,
      orderId,
      formattedDate,
      reportData.byValue || null,
      reportData.reportComments || null,
      reportData.whereValue || null,
      reportData.vendorName || null,
      reportData.subCategory || null,
      reportData.subCategory01 || null,
      reportData.subCategory02 || null,
      reportData.subCategory03 || null,
      reportData.instrumentValue || null,
      reportData.instrumentValue01 || null,
      reportData.instrumentValue02 || null,
      reportData.instrumentValue03 || null,
      reportData.numberValue || null,
      reportData.numberValue01 || null,
      reportData.numberValue02 || null,
      reportData.numberValue03 || null,
    ];

    // Filter out empty values and corresponding columns
    const filteredColumns = columns.filter((_, index) => values[index] !== null);
    const filteredValues = values.filter(value => value !== null);

    // Build the query
    const query = `
      INSERT INTO tblMaintainenceReports 
      (${filteredColumns.join(', ')})
      VALUES (${filteredValues.map(value => `'${value}'`).join(', ')})
    `;

    // Step 3: Insert the new report using raw SQL
    await sequelize.query(query);

    return { message: 'Report created successfully' };
  } catch (error) {
    console.error('Error creating new report:', error);
    throw new Error(`Error creating new report: ${error.message}`);
  }
};





  // export const insertEquipmentTableData = async (body) => {
  //   try {
  //     const reportID = parseInt(body.ReportID, 10);
  //     if (isNaN(reportID)) {
  //       throw new Error('Invalid ReportID, must be an integer');
  //     }
      
  //     const report = await tblMaintainenceReports.findOne({
  //       where: {
  //         OrderID: reportID,
  //       },
  //       attributes: ['No'], 
  //     });
  
  //     let noValue = null;
  //     if (report) {
  //       noValue = report.No; 
  //       console.log('Fetched No value:', noValue); 
  //     } else {
  //       throw new Error('No record found for the given OrderID');
  //     }
  
  //     // Step 3: Construct the raw SQL query for insertion
  //     const sqlQuery = `
  //       INSERT INTO tblMaintReportMeasurements (ReportID, UOM, Applied, Reading, Adjusted, Min)
  //       VALUES (:ReportID, :UOM, :Applied, :Reading, :Adjusted, :Min)
  //     `;
  
  //     // Execute the query with the values from the body
  //     const result = await sequelize.query(sqlQuery, {
  //       replacements: {
  //         ReportID: noValue || 0, // Ensure you're using the fetched No value as ReportID
  //         UOM: body.UOM,
  //         Applied: body.Applied,
  //         Reading: body.Reading,
  //         Adjusted: body.Adjusted,
  //         Min: body.Min,
  //       },
  //       type: sequelize.QueryTypes.INSERT, 
  //     });
  
  //     console.log('Insert result:', result); 
  //     return result;
  //   } catch (error) {
  //     console.error('Error inserting equipment data:', error); 
  //     throw new Error(`Error inserting equipment data: ${error.message}`); 
  //   }
  // };
  



// ok code
  export const insertEquipmentTableData = async (body) => {
    try {
      const reportID = parseInt(body.ReportID, 10);
      if (isNaN(reportID)) {
        throw new Error('Invalid ReportID, must be an integer');
      }
      const report = await tblMaintainenceReports.findOne({
        where: {
          OrderID: reportID,
        },
        attributes: ['No'],
      });
  
      let noValue = null;
      if (report) {
        noValue = report.No; 
        console.log('Fetched No value:', noValue); 
      } else {
        throw new Error('No record found for the given OrderID');
      }
  
      // Step 3: Construct the raw SQL query for insertion
      const sqlQuery = `
        INSERT INTO tblMaintReportMeasurements (ReportID, UOM, Applied, Reading, Adjusted, Min)
        VALUES (:ReportID, :UOM, :Applied, :Reading, :Adjusted, :Min)
      `;
  
      // Execute the query with the values from the body
      await sequelize.query(sqlQuery, {
        replacements: {
          ReportID: noValue || 0,
          UOM: body.UOM,
          Applied: body.Applied,
          Reading: body.Reading,
          Adjusted: body.Adjusted,
          Min: body.Min,
        },
        type: sequelize.QueryTypes.INSERT,
      });
  
    const [insertedRecords] = await tblMaintReportMeasurements.findAll({
        where: {
          ReportID: noValue || 0,
        },
        order: [['ReportID', 'DESC']], 
        raw: true,
      });
    
      console.log(insertedRecords)
      return insertedRecords;
  
    } catch (error) {
      console.error('Error inserting equipment data:', error); 
      throw new Error(`Error inserting equipment data: ${error.message}`); 
    }
  };
  
  




















// async function fillComboBox() {
//   const instruments = await CurrentBP.findAll({
//       attributes: [
//           [sequelize.fn('concat', sequelize.literal("'#'"), sequelize.col('model'), sequelize.literal(" ' ' "), sequelize.col('description')), 'instrument']
//       ],
//       where: {
//           parttype: 'Instrument'
//       },
//       order: [['model', 'ASC']]
//   });

//   return instruments.map(item => item.instrument);
// }





// async function refreshLVW(reportId) {
//   const measurements = await tblMaintReportMeasurements.findAll({
//       where: { ReportID: reportId }
//   });

//   return measurements.map(measurement => ({
//       uniqueID: measurement.uniqueID,
//       UOM: measurement.UOM,
//       Applied: measurement.Applied,
//       Reading: measurement.Reading,
//       Adjusted: measurement.Adjusted,
//       Min: measurement.Min,
//   }));
// }





















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

