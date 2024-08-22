// api/common/getInspectionNumbers.js

import { getInspectionNumberList } from "~/server/controller/common/Vendor";

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;
        const query = getQuery(event);
        const partType = query.PARTTYPE;
        const subCategory = query.SUBCATEGORY;

        if (!partType || !subCategory) {
            setResponseStatus(event, 400);
            return { error: 'PARTTYPE and SUBCATEGORY are required' };
        }

        switch (method.toUpperCase()) {
            case 'GET':
                const inspectionNumbers = await getInspectionNumberList(partType, subCategory);
                return { body: inspectionNumbers, message: '' };
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
