import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    const method = event.node.req.method;
    switch (method.toUpperCase()) {
        case 'GET':
            const { model } = getQuery(event);
            const query = `SELECT number, ROUND(SUM(required), 0) As count
                    FROM MRP8
                    WHERE model =:model
                    GROUP BY number;`
            const data = await sequelize.query(query, {
                replacements: { model },
                type: QueryTypes.SELECT,
                plain: false,
                raw: true
            });
            console.log('Query Results:', data);
            const result = data.map(item => {
                return { job: `${item.number} = ${item.count}` };
            });
            return result

        default:
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
    }
});