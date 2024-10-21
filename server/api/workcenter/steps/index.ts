import { createNewStep } from "~/server/controller/workcenter";

export default eventHandler(async (event) => {
    try {
        const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'POST':
                const data = await readBody(event)
                const newStep = await createNewStep(data)
                return { body: { newStep }, message: 'New Job created successfully!' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});