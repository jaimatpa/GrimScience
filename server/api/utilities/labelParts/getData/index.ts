import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default defineEventHandler(async (event) => {
  try {
    const { model } = getQuery(event);

    // SQL Server specific query with proper pagination
    const query = `
      SELECT 
        p.*,
        CASE 
          WHEN ISNULL(p.workcenters, '') = '' THEN 0 
          ELSE 1 
        END as hasWorkCenters
      FROM tblBP p
      INNER JOIN (
        SELECT instanceid, MAX(uniqueid) as maxid
        FROM tblBP WITH (NOLOCK)
        GROUP BY instanceid
      ) latest ON p.uniqueid = latest.maxid
      WHERE 
        p.partflag = 1
        ${model ? 'AND p.model LIKE :modelSearch' : ''}
      ORDER BY p.model, p.today
      OFFSET 0 ROWS
      FETCH NEXT 100 ROWS ONLY;
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        modelSearch: model ? `%${model}%` : null
      }
    });

    return {
      statusCode: 200,
      body: {
        searchData: results
      }
    };

  } catch (error) {
    console.error('Error fetching parts:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    };
  }
});

