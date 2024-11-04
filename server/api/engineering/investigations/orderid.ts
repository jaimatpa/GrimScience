import { getInvestigationComplaints } from '~/server/controller/engineering';
import sequelize from '~/server/utils/databse';

export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { ...params } = getQuery(event);

        switch (method) {
            case 'GET':
                const fullComplaint = sequelize.query(`SELECT * FROM tblInvestigationComplaint WHERE PANO = ${params.PANO}`);
                const orderId = await sequelize.query(`select orderid from tblOrder where complaintID = ${params.complaintId}`);
                console.log('orderId:', orderId);
                return { body: orderId, message: "" };
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});