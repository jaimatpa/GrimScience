import sequelize from "~/server/utils/databse";


export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;
        switch (method.toUpperCase()) {
            case 'GET':
                const [results] = await sequelize.query('SELECT MAX(PONUMBER) AS maxPONumber FROM tblPO');
                return { body: results[0].maxPONumber+1  , message: '' };
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        console.error(error);
        setResponseStatus(event, 500);
        return { error: `Error fetching data: ${error.message}` };
    }
});