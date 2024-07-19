import { getResponsibilites } from '~/server/controller/workcenter';

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const catagory = await getResponsibilites()
                return { body: catagory, message: 'Responsibilites Fetched Successfully' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});