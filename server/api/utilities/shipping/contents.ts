import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    try {
        const { instanceId } = getQuery(event);

        if (!instanceId) {
            setResponseStatus(event, 400);
            return {
                error: "Missing required query parameter: instanceId",
            };
        }
        const query = `Select * from tblshippingcombinations inner join tblbp on tblbp.uniqueid = tblshippingcombinations.bpid where tblshippingcombinations.instanceid = ${instanceId} order by model`
        const body = await sequelize.query(query, { type: QueryTypes.SELECT })
        return {
            message: "Successfully fetched contents", body
        };
    } catch (error) {
        setResponseStatus(event, 500);
        console.log(error.message);
        return { error: error.message };
    }
})