import { tblBP } from '~/server/models';
import { Sequelize, Op, QueryTypes } from 'sequelize';
import sequelize from '~/server/utils/databse';

// ok ok code
export const getAllData = async (modelNumber) => {
  try {
    const data = await tblBP.findAll({
      where: {
        model: {
          [Op.like]: `%${modelNumber.MODEL}%`
        },
        partflag: 1,
        UniqueID: {
          [Op.in]: Sequelize.literal(`
            (SELECT MAX(UniqueID) 
             FROM tblBP 
             GROUP BY instanceID)
          `),
        },
      },
      order: [
        ['model', 'ASC'],
        ['today', 'ASC']
      ],
      limit: 300
    });

    // console.log(`Data fetched:`, data);
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Ok Code
export const getJobOperationsById = async (params) => {
  const { MODEL } = params;
  // console.log("Hello, I am from the controller", MODEL);
  try {
    if (!MODEL || (Array.isArray(MODEL) && MODEL.length === 0)) {
      throw new Error('Invalid MODEL parameter');
    }
    const replacements = {};
    MODEL.forEach((model, index) => {
      replacements[`model${index}`] = model;
    });
    const queryUniqueModels = `
      WITH ModelInput AS (
        SELECT value AS MODEL
        FROM (VALUES ${MODEL.map((_, index) => `(:model${index})`).join(', ')}) AS ModelList(value)
      ),
      UniqueModels AS (
        SELECT 
          t.MODEL,
          STRING_AGG(t.workcenters, ',') AS workcenters,
          MAX(wc.NUMBER) AS workcenter_number,
          MAX(t.DESCRIPTION) AS DESCRIPTION,
          MAX(t.SUBCATEGORY) AS SUBCATEGORY,
          MAX(t.PARTTYPE) AS PARTTYPE
        FROM ModelInput mi
        LEFT JOIN tblBP t WITH (NOLOCK) ON t.MODEL = mi.MODEL
        LEFT JOIN tblWorkCenters wc WITH (NOLOCK) ON TRY_CAST(t.workcenters AS INT) = wc.uniqueID
        WHERE t.DESCRIPTION IS NOT NULL AND t.MODEL IS NOT NULL
        GROUP BY t.MODEL
      )
      SELECT * FROM UniqueModels
      ORDER BY MODEL;
    `;

    const uniqueModels = await sequelize.query(queryUniqueModels, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: replacements,
    });
    
    const reports = MODEL.flatMap(model => {
      const modelData = uniqueModels.find(entry => entry.MODEL === model);
      return modelData ? [modelData] : [];
    });

    // console.log(reports);
    return reports;
  } catch (error) {
    console.error('Error in getJobOperationsById:', error);
    
    if (error.name === 'SequelizeDatabaseError') {
      const errorMessage = error.message || '';
      if (errorMessage.includes('converting data type')) {
        console.warn('Data type conversion issue:', errorMessage);
        // return getFallbackResults(MODEL);
      } else if (errorMessage.includes('Invalid object name')) {
        throw new Error('Table not found. Please check if tblBP or tblWorkCenters exists.');
      } else {
        throw new Error(`Database error: ${errorMessage}`);
      }
    } else if (error.name === 'SequelizeConnectionError') {
      throw new Error('Unable to connect to the SQL Server database');
    } else {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
};


// export const getJobOperationsById = async (params) => {
//   const { MODEL } = params;
//   console.log("Hello, I am from the controller", MODEL);
//   try {
//     if (!MODEL || (Array.isArray(MODEL) && MODEL.length === 0)) {
//       throw new Error('Invalid MODEL parameter');
//     }
//     const paramPlaceholders = MODEL.map((_, index) => `:model${index}`).join(',');
//     const replacements = {};
//     MODEL.forEach((model, index) => {
//       replacements[`model${index}`] = model;
//     });
//     const query = `
//       WITH ModelInput AS (
//         SELECT value AS MODEL
//         FROM (VALUES ${MODEL.map((_, index) => `(:model${index})`).join(', ')}) AS ModelList(value)
//       )
//       SELECT 
//         t.MODEL,
//         STRING_AGG(t.workcenters, ',') AS workcenters,       
//         MAX(wc.NUMBER) AS workcenter_number,                     
//         MAX(t.DESCRIPTION) AS DESCRIPTION,
//         MAX(t.SUBCATEGORY) AS SUBCATEGORY,
//         MAX(t.PARTTYPE) AS PARTTYPE
//       FROM ModelInput mi
//       LEFT JOIN tblBP t WITH (NOLOCK) ON t.MODEL = mi.MODEL
//       LEFT JOIN tblWorkCenters wc WITH (NOLOCK) ON TRY_CAST(t.workcenters AS INT) = wc.uniqueID
//       WHERE t.DESCRIPTION IS NOT NULL AND t.MODEL IS NOT NULL
//       GROUP BY t.MODEL                                      
//       ORDER BY t.MODEL;
//     `;

//     // Execute the query
//     const reports = await sequelize.query(query, {
//       type: QueryTypes.SELECT,
//       raw: true,
//       replacements: replacements,
//     });
    
//     console.log(reports);
//     return reports;
//   } catch (error) {
//     console.error('Error in getJobOperationsById:', error);
    
//     if (error.name === 'SequelizeDatabaseError') {
//       const errorMessage = error.message || '';
//       if (errorMessage.includes('converting data type')) {
//         console.warn('Data type conversion issue:', errorMessage);
//         return getFallbackResults(MODEL);
//       } else if (errorMessage.includes('Invalid object name')) {
//         throw new Error('Table not found. Please check if tblBP or tblWorkCenters exists.');
//       } else {
//         throw new Error(`Database error: ${errorMessage}`);
//       }
//     } else if (error.name === 'SequelizeConnectionError') {
//       throw new Error('Unable to connect to the SQL Server database');
//     } else {
//       throw new Error(`Error fetching data: ${error.message}`);
//     }
//   }
// };

// const getFallbackResults = async (MODEL) => {
//   const fallbackQuery = `
//     SELECT 
//       t.MODEL,
//       t.workcenters,
//       COUNT(t.MODEL) as modelCount,
//       MAX(t.DESCRIPTION) as DESCRIPTION,
//       MAX(t.SUBCATEGORY) as SUBCATEGORY,
//       MAX(t.PARTTYPE) as PARTTYPE,
//       MAX(t.MODEL) as MODEL
//     FROM tblBP t WITH (NOLOCK)
//     WHERE t.DESCRIPTION IS NOT NULL 
//       AND t.MODEL IS NOT NULL
//       AND t.MODEL IN (:models)
//     GROUP BY 
//       t.MODEL, 
//       t.workcenters
//     ORDER BY t.MODEL;
//   `;

//   const fallbackReports = await sequelize.query(fallbackQuery, {
//     type: QueryTypes.SELECT,
//     raw: true,
//     replacements: {
//       models: Array.isArray(MODEL) ? MODEL : [MODEL]
//     }
//   });

//   return transformResults(fallbackReports);
// };

// // Transform results
// const transformResults = (reports) => {
//   return reports.map(report => ({
//     MODEL: report.MODEL?.trim(),
//     workcenters: report.workcenters?.trim(),
//     workcenter_number: report.workcenter_number?.trim(),
//     modelCount: parseInt(report.modelCount, 10),
//     DESCRIPTION: report.DESCRIPTION?.trim(),
//     SUBCATEGORY: report.SUBCATEGORY?.trim(),
//     PARTTYPE: report.PARTTYPE?.trim()
//   }));
// };
