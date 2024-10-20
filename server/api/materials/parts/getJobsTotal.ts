import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
  const method = event.node.req.method;
  switch (method.toUpperCase()) {
    case "GET":
      const { instanceId } = getQuery(event);
      const query = `
                SELECT DISTINCT 
                    '#' + tblA.MODEL + ' ' + tblA.DESCRIPTION AS Expr1, 
                    tblA.instanceID 
                FROM 
                    tblBP AS tblA 
                    INNER JOIN tblBPParts ON tblBPParts.instanceid = tblA.instanceID 
                    INNER JOIN tblBP AS tblB ON tblBPParts.partid = tblB.UniqueID 
                WHERE 
                    tblB.InstanceID = :instanceId
                ORDER BY 
                    '#' + tblA.MODEL + ' ' + tblA.DESCRIPTION DESC;
            `;
      const data = await sequelize.query(query, {
        replacements: { instanceId },
        type: QueryTypes.SELECT,
        plain: false,
        raw: true,
      });

      return data;

    default:
      event.node.res.statusCode = 405;
      return { error: "Method Not Allowed" };
  }
});
