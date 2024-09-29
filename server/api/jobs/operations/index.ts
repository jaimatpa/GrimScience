import { getAllOperation } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
    try {
        const { jobId, model } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const list = await getAllOperation(jobId, model);
                return { body: list, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});