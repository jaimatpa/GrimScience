import { getAllWorkCenters } from "~/server/controller/workcenter";

export default eventHandler(async (event) => {
    try {
        const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const list = await getAllWorkCenters(sortBy, sortOrder, filterParams);
                return { body: list, message: '' }
            // case 'POST':
            //     const data = await readBody(event)
            //     const newCustomer = await createNewJob(data)
            //     return { body: { newCustomer }, message: 'New Job created successfully!' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});