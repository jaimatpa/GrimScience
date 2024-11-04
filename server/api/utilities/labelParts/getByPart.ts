import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";


export default defineEventHandler(async (event) => {
  try {
    const {id} = getQuery(event)

    if (!id) {
      return {
        statusCode: 400,
        body: { error: 'Part ID is required' }
      };
    }

    // Get part details with NOLOCK hint
    const partQuery = `
      SELECT workcenters
      FROM tblBP WITH (NOLOCK)
      WHERE uniqueid = :id;
    `;

    const [part] = await sequelize.query(partQuery, {
      type: QueryTypes.SELECT,
      replacements: { id }
    });

    if (!part?.workcenters) {
      return {
        statusCode: 200,
        body: { results: [] }
      };
    }

    // Get work centers using proper SQL Server string splitting
    const workCentersQuery = `
      SELECT wc.uniqueid, wc.number
      FROM tblWorkCenters wc WITH (NOLOCK)
      INNER JOIN STRING_SPLIT(:workcenters, ',') ws 
      ON wc.uniqueid = CAST(TRIM(ws.value) AS INT)
      WHERE TRIM(ws.value) != '';
    `;

    const workCenters = await sequelize.query(workCentersQuery, {
      type: QueryTypes.SELECT,
      replacements: { 
        workcenters: part.workcenters
      }
    });

    return {
      statusCode: 200,
      body: { results: workCenters }
    };

  } catch (error) {
    console.error('Error fetching work centers:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    };
  }
});
