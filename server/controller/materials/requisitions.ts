import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblRequisitionDetail, tblBP, tblMaintainenceOrders, tblWorkStation, tblMaintainenceReports, tblMaintReportMeasurements } from "~/server/models";
import sequelize from "~/server/utils/databse";
const applyFilters = (params) => {

  const filterParams = [
   
    "SUBCATAGORY",
  
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


export const getAllEmployeeList = async () => {
  try {
    const reasons = await tblRequisitionDetail.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("EMPLOYEE")), "EMPLOYEE"]
      ],
      order: [["EMPLOYEE", "ASC"]],
      raw: true,
    });

    const categories = reasons.map(item => item.EMPLOYEE);

    return categories.length ? categories : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" };
  }
};


// ok code

export const insertRequisitionData = async (body) => {
  const {
    Needed,
    STOCKNUMBER,
    date,
    RequireDate,
    Employee,
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
    Date: formatDate(date), 
    QTY: parseInt(Needed, 10), 
    EMPLOYEE: Employee,
    STOCKNUMBER: STOCKNUMBER,
    reqdate: RequireDate ? formatDate(RequireDate) : null, 
  };

  try {
    // Check if the uniqueID exists or create a new record
    const query = `
      INSERT INTO tblRequisitionDetail (${Object.keys(finalData).join(',')})
      VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;

    await sequelize.query(query, {
      replacements: finalData,  // Pass the finalData object for insertion
    });

    return {
      success: true,
      message: "Record created successfully",
      data: finalData,
    };
  } catch (error) {
    console.error("Error in insertRequisitionData:", error);
    return {
      success: false,
      message: "Error processing request",
      error: error.message,
    };
  }
};
  
// ok code
export const deleteRequisitionData = (id) => {
  if (!id) {
    throw new Error("ID is required for deletion.");
  }
  
  return sequelize.query(`DELETE FROM tblRequisitionDetail WHERE UniqueID = :id`, {
    replacements: { id }, 
  });
};


  


// export const getAllTRefutationData = async (filterParams) => {
//   const {
//     page,
//     pageSize,
//     sortBy,
//     sortOrder,
//     search,
//     QTY,
//     DESCRIPTION,
//     STOCKNUMBER,
//     PONumber,  // Make sure this field exists in the model
//   } = filterParams;

//   try {
//     // Build dynamic conditions for filtering
//     const whereConditions = {};

//     // If a search term is provided, apply it across multiple fields
//     if (search) {
//       whereConditions[Op.or] = [
//         { QTY: { [Op.like]: `%${search}%` } },
//         { DESCRIPTION: { [Op.like]: `%${search}%` } },
//         { PONumber: { [Op.like]: `%${search}%` } },
//         { STOCKNUMBER: { [Op.like]: `%${search}%` } },
//       ];
//     }

//     // Filter by QTY if provided
//     if (QTY) {
//       whereConditions.QTY = { [Op.like]: `%${QTY}%` };
//     }

//     // Filter by PONumber if provided
//     if (PONumber) {
//       whereConditions.PONumber = { [Op.like]: `%${PONumber}%` };
//     }

//     // Filter by DESCRIPTION if provided
//     if (DESCRIPTION) {
//       whereConditions.DESCRIPTION = { [Op.like]: `%${DESCRIPTION}%` };
//     }

//     // Filter by STOCKNUMBER if provided
//     if (STOCKNUMBER) {
//       whereConditions.STOCKNUMBER = { [Op.like]: `%${STOCKNUMBER}%` };
//     }

//     // Query the database with the filter conditions
//     const requisitionDetails = await tblRequisitionDetail.findAll({
//       where: whereConditions,  // Apply the dynamic where conditions
//       order: [[sortBy || "STOCKNUMBER", sortOrder || "ASC"]],  // Sorting by the given column or default to STOCKNUMBER
//       offset: (page - 1) * pageSize,  // Pagination - offset for the page
//       limit: pageSize,  // Limit the number of records
//       raw: true,  // Get plain data (without Sequelize model instance)
//     });

//     // Map the result to extract STOCKNUMBER or any other desired field
//     const categories = requisitionDetails.map(item => item.STOCKNUMBER);

//     // Log the categories for debugging
//     console.log(categories);

//     // Return the results or an error message if no results found
//     return categories.length ? categories : { error: "No data found" };
//   } catch (error) {
//     // Handle any errors that occur during the query
//     console.error("Database error:", error);
//     return { error: error.message || "Failed to fetch data" };
//   }
// };



export const getAllTRefutationData = async (filterParams) => {
  const {
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    QTY,
    DESCRIPTION,
    STOCKNUMBER,
    PONumber, 
    EMPLOYEE
  } = filterParams;
  const pageInt = parseInt(page, 10);
  const pageSizeInt = parseInt(pageSize, 10);

  if (isNaN(pageInt) || isNaN(pageSizeInt)) {
    return { error: "Page and pageSize must be valid integers." };
  }

  try {
    const whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [
        { QTY: { [Op.like]: `%${search}%` } },
        { DESCRIPTION: { [Op.like]: `%${search}%` } },
        { PONumber: { [Op.like]: `%${search}%` } },
        { STOCKNUMBER: { [Op.like]: `%${search}%` } },
        { EMPLOYEE: { [Op.like]: `%${search}%` } },
        
      ];
    }

    // Filter by QTY if provided
    if (QTY) {
      whereConditions.QTY = { [Op.like]: `%${QTY}%` };
    }

    // Filter by PONumber if provided
    if (PONumber) {
      whereConditions.PONumber = { [Op.like]: `%${PONumber}%` };
    }

    // Filter by DESCRIPTION if provided
    if (DESCRIPTION) {
      whereConditions.DESCRIPTION = { [Op.like]: `%${DESCRIPTION}%` };
    }

    // Filter by STOCKNUMBER if provided
    if (STOCKNUMBER) {
      whereConditions.STOCKNUMBER = { [Op.like]: `%${STOCKNUMBER}%` };
    }
    if (EMPLOYEE) {
      whereConditions.EMPLOYEE = { [Op.like]: `%${EMPLOYEE}%` };
    }
    // Query the database with the filter conditions
    const requisitionDetails = await tblRequisitionDetail.findAll({
      where: whereConditions,  // Apply the dynamic where conditions
      order: [[sortBy || "STOCKNUMBER", sortOrder || "ASC"]],  // Sorting by the given column or default to STOCKNUMBER
      offset: (pageInt - 1) * pageSizeInt,  // Pagination - offset for the page
      limit: pageSizeInt,  // Limit the number of records
      raw: true,  // Get plain data (without Sequelize model instance)
    });

    const categories = requisitionDetails;
    return categories.length ? categories : { error: "No data found" };
  } catch (error) {
    // Handle any errors that occur during the query
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch data" };
  }
};
















// export const getAllTableDataForRequisition = async () => {
//   try {
//     const reasons = await tblRequisitionDetail.findAll({


//       attributes: [
//         [Sequelize.fn("DISTINCT", Sequelize.col("Description")), "EMPLOYEE"]
//       ],
//       order: [["EMPLOYEE", "ASC"]],
//       raw: true,
//     });

//     const categories = reasons.map(item => item.EMPLOYEE);

//     return categories.length ? categories : { error: "No reasons found" };
//   } catch (error) {
//     console.error("Database error:", error);
//     return { error: error.message || "Failed to fetch reasons for change" };
//   }
// };

// export const getAllTableDataForRequisition = async (page = 1, pageSize = 500) => {
//   const offset = (page - 1) * pageSize;
//   try {
//     const rawQuery = `
//       SELECT 
//         bp.PARTTYPE, 
//         bp.SUBCATEGORY, 
//         rq.DESCRIPTION, 
//         rq.STOCKNUMBER 
//       FROM 
//         tblBP AS bp
//       LEFT JOIN 
//         tblRequisitionDetail AS rq
//       ON 
//         bp.uniqueid = rq.partnumber
//       ORDER BY bp.uniqueid 
//       OFFSET :offset ROWS
//       FETCH NEXT :pageSize ROWS ONLY;
//     `;

//     // Execute raw SQL query
//     const results = await sequelize.query(rawQuery, {
//       replacements: { offset, pageSize },
//       type: sequelize.QueryTypes.SELECT,
//       raw: true
//     });
    

//     return results;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error(error.message || "Failed to fetch data for requisitions");
//   }
// };

export const getAllTableDataForRequisition = async (filterParams) => {
  const {
    page,
    pageSize ,
    sortBy ,
    sortOrder ,
    search,
    PARTTYPE,
    SUBCATEGORY,
    DESCRIPTION,
    STOCKNUMBER
  } = filterParams;

  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  
  try {
    let whereClause = '1=1'; // This ensures the WHERE clause is always valid

    if (search) {
      whereClause += ` AND (bp.PARTTYPE LIKE :search OR bp.SUBCATEGORY LIKE :search OR rq.DESCRIPTION LIKE :search OR rq.STOCKNUMBER LIKE :search)`;
    }

    // Add more specific filters
    if (PARTTYPE) {
      whereClause += ` AND bp.PARTTYPE LIKE :PARTTYPE`;
    }
    if (SUBCATEGORY) {
      whereClause += ` AND bp.SUBCATEGORY LIKE :SUBCATEGORY`;
    }
    if (DESCRIPTION) {
      whereClause += ` AND rq.DESCRIPTION LIKE :DESCRIPTION`;
    }
    if (STOCKNUMBER) {
      whereClause += ` AND rq.STOCKNUMBER LIKE :STOCKNUMBER`;
    }

    const rawQuery = `
      SELECT 
        bp.PARTTYPE,
        bp.SUBCATEGORY,
        rq.DESCRIPTION,
        rq.STOCKNUMBER
      FROM
        tblBP AS bp
      LEFT JOIN
        tblRequisitionDetail AS rq
      ON
        bp.uniqueid = rq.partnumber
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      OFFSET :offset ROWS
      FETCH NEXT :pageSize ROWS ONLY;
    `;

    // Prepare replacements object
    const replacements = {
      offset,
      pageSize: parseInt(pageSize),
      search: search ? `%${search}%` : undefined,
      PARTTYPE: PARTTYPE ? `%${PARTTYPE}%` : undefined,
      SUBCATEGORY: SUBCATEGORY ? `%${SUBCATEGORY}%` : undefined,
      DESCRIPTION: DESCRIPTION ? `%${DESCRIPTION}%` : undefined,
      STOCKNUMBER: STOCKNUMBER ? `%${STOCKNUMBER}%` : undefined,
    };

    // Execute raw SQL query

 
    const results = await sequelize.query(rawQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tblBP AS bp
      LEFT JOIN tblRequisitionDetail AS rq ON bp.uniqueid = rq.partnumber
      WHERE ${whereClause}
    `;

    const [{ total }] = await sequelize.query(countQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
    // console.log(results)
    return {
      data: results,
      total: parseInt(total),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      sortBy,
      sortOrder
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(error.message || "Failed to fetch data for requisitions");
  }
};


// export const getAllTableDataForRequisition = async (  
//   page,
//   pageSize,
//   sortBy,
//   sortOrder,
//   filterParams
// ) => {
//   const offset = (page - 1) * pageSize;
//   try {
//     let whereClause = '1=1'; // This ensures the WHERE clause is always valid

//     if (search) {
//       whereClause += ` AND (bp.PARTTYPE LIKE :search OR bp.SUBCATEGORY LIKE :search OR rq.DESCRIPTION LIKE :search OR rq.STOCKNUMBER LIKE :search)`;
//     }

//     // Add more specific filters
//     if (filterParams.PARTTYPE) {
//       whereClause += ` AND bp.PARTTYPE LIKE :PARTTYPE`;
//     }
//     if (filterParams.SUBCATEGORY) {
//       whereClause += ` AND bp.SUBCATEGORY LIKE :SUBCATEGORY`;
//     }
//     if (filterParams.DESCRIPTION) {
//       whereClause += ` AND rq.DESCRIPTION LIKE :DESCRIPTION`;
//     }
//     if (filterParams.STOCKNUMBER) {
//       whereClause += ` AND rq.STOCKNUMBER LIKE :STOCKNUMBER`;
//     }

//     const rawQuery = `
//       SELECT 
//         bp.PARTTYPE,
//         bp.SUBCATEGORY,
//         rq.DESCRIPTION,
//         rq.STOCKNUMBER
//       FROM
//         tblBP AS bp
//       LEFT JOIN
//         tblRequisitionDetail AS rq
//       ON
//         bp.uniqueid = rq.partnumber
//       WHERE ${whereClause}
//       ORDER BY bp.uniqueid
//       OFFSET :offset ROWS
//       FETCH NEXT :pageSize ROWS ONLY;
//     `;

//     // Prepare replacements object
//     const replacements = {
//       offset,
//       pageSize,
//       search: search ? `%${search}%` : undefined,
//       PARTTYPE: filterParams.PARTTYPE ? `%${filterParams.PARTTYPE}%` : undefined,
//       SUBCATEGORY: filterParams.SUBCATEGORY ? `%${filterParams.SUBCATEGORY}%` : undefined,
//       DESCRIPTION: filterParams.DESCRIPTION ? `%${filterParams.DESCRIPTION}%` : undefined,
//       STOCKNUMBER: filterParams.STOCKNUMBER ? `%${filterParams.STOCKNUMBER}%` : undefined,
//     };

//     // Execute raw SQL query
//     const results = await sequelize.query(rawQuery, {
//       replacements,
//       type: sequelize.QueryTypes.SELECT,
//       raw: true
//     });
    
//     return results;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error(error.message || "Failed to fetch data for requisitions");
//   }
// };

// export const getAllTableDataForRequisition = async (page = 1, pageSize = 100) => {

//   const offset = (page - 1) * pageSize;
//   try {
//     const rawQuery = `
//       SELECT 
//         bp.PARTTYPE, 
//         bp.SUBCATEGORY, 
//         rq.DESCRIPTION, 
//         rq.STOCKNUMBER 
//       FROM 
//         tblBP AS bp
//       LEFT JOIN 
//         tblRequisitionDetail AS rq
//       ON 
//         bp.uniqueid = rq.partnumber;
//         LIMIT :pageSize OFFSET :offset;
//     `;

//     // Execute raw SQL query
//     const results = await sequelize.query(rawQuery, {
//       type: sequelize.QueryTypes.SELECT,
//       raw: true
//     });
//     console.log(results)
//     return results;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error(error.message || "Failed to fetch data for requisitions");
//   }
// };

// export const getAllTableDataForRequisition = async () => {
//   try {
//     // Perform the JOIN between tblRequisitionDetail and tblBP
//     const results = await tblRequisitionDetail.findAll({
//       attributes: [
//         [Sequelize.fn("DISTINCT", Sequelize.col("tblRequisitionDetail.EMPLOYEE")), "EMPLOYEE"],
//         [Sequelize.col("tblBP.subcategory"), "SUBCATEGORY"],
//         [Sequelize.col("tblRequisitionDetail.STOCKNUMBER"), "STOCKNUMBER"],
//         [Sequelize.col("tblRequisitionDetail.DESCRIPTION"), "DESCRIPTION"]
//       ],
//       include: [
//         {
//           model: tblBP,
//           required: true, 
//           attributes: []  
//         }
//       ],
//       order: [["EMPLOYEE", "ASC"]],
//       raw: true,
//     });

//     // You can directly return the result
//     return results.length ? results : { error: "No data found" };
//   } catch (error) {
//     console.error("Database error:", error);
//     return { error: error.message || "Failed to fetch data for requisitions" };
//   }
// };









export const fetchInventoryRequisitionsApi = async (params) => {
  const { category, subCategory, employee, openOnly, page = 1, pageSize = 50, sortBy = 'UniqueID', sortOrder = 'asc' } = params

  let whereClause = ''
  let strsql = ''
  const searchFields = ['PARTTYPE', 'SUBCATEGORY', 'MODEL', 'DESCRIPTION', 'OnHand', 'ETLCriticalComponent']

  searchFields.forEach(field => {
    const value = params[field.toLowerCase()]
    if (value) {
      whereClause += ` AND (${field} LIKE '${value}%' OR ${field} IS NULL)`
      if (!['QTYORDER', 'QTYAVAILABLE', 'PONUMBER'].includes(field)) {
        strsql += `${field},`
      }
    }
  })

  if (employee) whereClause += ` AND employee LIKE '%${employee}%'`
  if (openOnly === 'false') whereClause += ` AND TRIM(PONumber) = ''`

  const sqlQuery = `
    SELECT TOP ${pageSize} ${strsql} uniqueid
    FROM tblRequisitionDetail
    WHERE 1=1 ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    OFFSET ${(page - 1) * pageSize} ROWS
  `

  const requisitions = await query(sqlQuery)

  for (let req of requisitions) {
    const qtyOrderQuery = `
      SELECT SUM((ORDERED - received)*multiple) 
      FROM tblPODETAIL 
      JOIN tblBP B ON B.model = tblPODetail.Stocknumber 
      AND B.uniqueID = (SELECT MAX(uniqueID) FROM tblBP C WHERE B.model = C.model) 
      WHERE tblpodetail.STOCKNUMBER = '${req.stockNumber}'
    `
    const qtyOrderResult = await query(qtyOrderQuery)
    req.QTYORDER = Math.max(0, Number(qtyOrderResult[0]?.[''] || 0))

    const qtyAvailableQuery = `
      SELECT onhand FROM vwCurrentBP WHERE model = '${req.stockNumber}'
    `
    const qtyAvailableResult = await query(qtyAvailableQuery)
    req.QTYAVAILABLE = Math.round(Number(qtyAvailableResult[0]?.onhand || 0))

    const poNumberQuery = `
      SELECT STRING_AGG(tblPO.PONUMBER, ',') 
      FROM tblPO 
      JOIN tblPODetail ON tblPODetail.pouid = tblPO.UniqueID 
      WHERE tblPODetail.STOCKNUMBER = '${req.stockNumber}' 
      AND tblPODetail.ORDERED - tblPODetail.RECEIVED > 0
    `
    const poNumberResult = await query(poNumberQuery)
    req.PONumber = poNumberResult[0]?.[''] || ''
  }

  return requisitions
}






export const createInventoryRequisitionApi = async (params) => {
  const { employeeId, stockNumber, quantity, description } = params

  const insertQuery = `
    INSERT INTO tblRequisitionDetail (employee, stocknumber, qtyorder, description)
    VALUES (@employeeId, @stockNumber, @quantity, @description)
  `

  await execute(insertQuery, { employeeId, stockNumber, quantity, description })
}

export const updateInventoryRequisitionApi = async (params) => {
  const { id, poNumber } = params

  const updateQuery = `
    UPDATE tblRequisitionDetail
    SET PONumber = @poNumber
    WHERE uniqueID = @id
  `

  await execute(updateQuery, { id, poNumber })
}

export const deleteInventoryRequisitionApi = async (id) => {
  const deleteQuery = `
    DELETE FROM tblRequisitionDetail
    WHERE uniqueID = @id
  `

  await execute(deleteQuery, { id })
}
