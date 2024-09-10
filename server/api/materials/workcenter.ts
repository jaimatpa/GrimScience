import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    const method = event.node.req.method;
    switch (method.toUpperCase()) {
       
case 'GET':
    const [results, metadata] = await sequelize.query(`
        SELECT [Name], [NUMBER],[UniqueId]
        FROM tblWorkCenters
        ORDER BY [NUMBER]
    `);
    return results.map((result) => ({
        UniqueId: result.UniqueId,
        location: `#${result.NUMBER} ${result.Name}`,
    }));

        default:
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
    }
});
