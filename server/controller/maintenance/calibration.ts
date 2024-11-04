import { Op, QueryTypes, Sequelize } from "sequelize";
import {  tblBP,tblCalibration,tblWorkCenters, tblEmployee, tblMaintReportMeasurements  } from "~/server/models";

import sequelize from "~/server/utils/databse";
import util from 'util';



export const getAllSubcategoriesList = async () => { 
    try {
      const subcategories = await tblBP.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("subcategory")), "subcategory"]
        ],
        where: {
          parttype: 'Instrument'
        },
        order: [["subcategory", "ASC"]],
        raw: true,
      });

      const result = subcategories.map(item => item.subcategory);
      return result.length ? result : { error: "No subcategories found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch subcategories" }; 
    }
};


export const getAllCalibrationsList = async () => { 
    try {
      const subcategories = await tblCalibration.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("CALIBRATIONREQ")), "CALIBRATIONREQ"]
        ],
        raw: true,
      });

      const result = subcategories.map(item => item.CALIBRATIONREQ);
      return result.length ? result : { error: "No subcategories found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch subcategories" }; 
    }
};




export const getAllUOMList = async () => { 
    try {
      const uomList = await sequelize.query(`
        SELECT DISTINCT UOM 
        FROM (
          SELECT UOM FROM tblCalibration
          UNION ALL
          SELECT UOM2 AS UOM FROM tblCalibration
          UNION ALL
          SELECT UOM3 AS UOM FROM tblCalibration
          UNION ALL
          SELECT UOM FROM tblMaintReportMeasurements
        ) AS derivedtbl_1
        ORDER BY UOM;
      `, {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
      });

      const result = uomList.map(item => item.UOM);
      return result.length ? result : { error: "No UOMs found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch UOMs" }; 
    }
};




export const getAllInstrumentLocations = async () => { 
    try {
      const instrumentLocations = await tblCalibration.findAll({
        attributes: ['PART'], 
        raw: true,
      });

      const result = instrumentLocations.map(item => item.PART);
      return result.length ? result : { error: "No instrument locations found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch instrument locations" }; 
    }
};


export const getAllWorkCenters = async () => { 
    try {
      const workCentersList = await tblWorkCenters.findAll({
        attributes: [
          [Sequelize.literal("CONCAT('#', Number, ' ', [Name])"), "number_name"]
        ],
        order: [["Number", "ASC"]],
        raw: true,
      });

      const result = workCentersList.map(item => item.number_name);
      return result.length ? result : { error: "No work centers found" };
    } catch (error) {
      console.error("Database error:", error);
      return { error: error.message || "Failed to fetch work centers" }; 
    }
};


export const getAllActiveEmployees = async () => { 
    try {
        const employeeList = await tblEmployee.findAll({
            attributes: [
                'uniqueid',
                [Sequelize.literal("CONCAT('#', payrollno, ' ', lname, ' ', fname)"), "employee_details"]
            ],
            where: {
                active: 1
            },
            order: [["payrollno", "ASC"]], 
            raw: true,
        });

        // Simply map to get array of employee_details values
        const result = employeeList.map(item => item.employee_details);
        
        // Return array if not empty, otherwise error object
        return result.length ? result : { error: "No active employees found" };
    } catch (error) {
        console.error("Database error:", error);
        return { error: error.message || "Failed to fetch employees" }; 
    }
};



export const removeReportTableData = (id) => {
  if (!id) {
    throw new Error("ID is required for deletion.");
  }

  // Cast the incoming id to an integer to match the database column type
  const numericId = parseInt(id, 10);
console.log(numericId)
  if (isNaN(numericId)) {
    throw new Error("Invalid ID format. ID must be a number.");
  }

  return sequelize.query(`DELETE FROM tblMaintReportMeasurements WHERE UniqueID = :id`, {
    replacements: { id: numericId },
  });
};



// export const insertCalibrationData = async (body) => { 

   
//     const formatDate = (dateString) => {
//       if (!dateString || dateString === "" || dateString === null) {
//         return null; 
//       }
  
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return null; 
//       }
  
//       const year = date.getUTCFullYear();
//       const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//       const day = String(date.getUTCDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`; 
//     };
//     const finalData = {
//       ...body,
//       DATE: formatDate(body.DATE) || body.DATE, 
      
//     };
  
//     try {
//       const result = await sequelize.query(`SELECT COALESCE(MAX(MANO), 0) + 1 AS maxNumber FROM tblCalibration`, {
//         type: sequelize.QueryTypes.SELECT,
//       });
//       finalData.MANO = result[0] ? result[0].maxNumber : 1;
  
//       // Construct insert query
//       const query = `INSERT INTO tblCalibration (${Object.keys(finalData).join(', ')}) VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})`;
//       await sequelize.query(query, {
//         replacements: finalData,
//       });
//       console.log("hello reeeeee",finalData)
//       return {
//         success: true,
//         message: "Record created successfully",
//         data: finalData,
//       };
//     } catch (error) {
//       console.error("Error in insertEquipmentData:", error);
//       return {
//         success: false,
//         message: "Error processing request",
//         error: error.message,
//       };
//     }
//   };
  
export const insertCalibrationData = async (body) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === null) {
      return null;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  try {
    const finalData = {
      ...body,
      DATE: formatDate(body.DATE) || body.DATE,
    };

    // Check if MANO exists
    const existingRecord = await sequelize.query(
      'SELECT MANO FROM tblCalibration WHERE MANO = :mano',
      {
        replacements: { mano: body.MANO },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      const updateFields = Object.keys(finalData)
        .map(key => `${key} = :${key}`)
        .join(', ');

      const updateQuery = `
        UPDATE tblCalibration 
        SET ${updateFields}
        WHERE MANO = :MANO
      `;

      await sequelize.query(updateQuery, {
        replacements: finalData,
      });

      return {
        success: true,
        message: "Record updated successfully",
        data: finalData,
      };

    } else {
      // Get next MANO value for new record
      const result = await sequelize.query(
        `SELECT COALESCE(MAX(MANO), 0) + 1 AS maxNumber FROM tblCalibration`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      finalData.MANO = result[0] ? result[0].maxNumber : 1;

      // Insert new record
      const insertQuery = `
        INSERT INTO tblCalibration (${Object.keys(finalData).join(', ')}) 
        VALUES (${Object.keys(finalData).map(key => `:${key}`).join(', ')})
      `;

      await sequelize.query(insertQuery, {
        replacements: finalData,
      });

      return {
        success: true,
        message: "Record created successfully",
        data: finalData,
      };
    }

  } catch (error) {
    console.error("Error in insertCalibrationData:", error);
    return {
      success: false,
      message: "Error processing request",
      error: error.message,
    };
  }
};

const applyFilters = (params) => {
    const filterParams = [
        'REQUIRED',
        'MANO',
        'SUBCATAGORY',
        'PART',
        'InstLoc',
        'ORDEREDBY',
        'ManSerial',
        'RemovedFromService',
    ];
    const whereClause = {};
    if (params.inService === 'false') {
        whereClause.RemovedFromService = {
            [Op.and]: [
                { [Op.ne]: '' },
                { [Op.ne]: null }
            ]
        };
    } else {
        whereClause.RemovedFromService = {
            [Op.or]: [
                { [Op.eq]: '' },
                { [Op.is]: null }
            ]
        };
    }
    filterParams.forEach((param) => {
        if (params[param]) {
            whereClause[param] = {
                [Op.like]: `%${params[param]}%`
            };
        }
    });

    return whereClause;
};

export const getCalibrationTableData01 = async (filterParams) => {
    try {
        const {
            page,
            pageSize,
            sortBy,
            sortOrder,
            inService,
            ...filters
        } = filterParams;

        const limit = parseInt(pageSize, 10) || 10;
        const offset = ((parseInt(page, 10) || 1) - 1) * limit;
        
        const list = await tblCalibration.findAll({
            where: {
                ...applyFilters({ ...filters, inService })
            },
            order: [[sortBy || 'REQUIRED', sortOrder || 'ASC']],
            offset,
            limit,
            raw: true
        });

        // Format the date in JavaScript
        const formattedList = list.map(item => ({
            ...item,
            REQUIRED: item.REQUIRED ? new Date(item.REQUIRED).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            }) : null
        }));

        return formattedList;
    } catch (error) {
        console.error("Error in getCalibrationTableData01:", error);
        throw error;
    }
};