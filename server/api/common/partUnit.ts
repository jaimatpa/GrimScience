import {  getUnitList } from "~/server/controller/common/getCategoryList";

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const categories = await getUnitList()
                return { body: categories, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});

