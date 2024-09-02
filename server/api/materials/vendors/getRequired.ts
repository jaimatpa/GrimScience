
import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    const method = event.node.req.method;
    switch (method.toUpperCase()) {
        case 'GET':
            const { model } = getQuery(event);
            const query = `
                SELECT  COALESCE(SUM(required), 0) AS required,
                    COALESCE(SUM(ordered), 0) AS ordered
                FROM MRP8
                WHERE model = :model;
                `
            const data = await sequelize.query(query, {
                replacements: { model },
                type: QueryTypes.SELECT,
                plain: false,
                raw: true
            });
            console.log('Query Results:', data);
            return data

        default:
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
    }
});