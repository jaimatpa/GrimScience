import { getSubCategoryList } from "~/server/controller/common/getCategoryList";

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;
        const query = getQuery(event);
        const partType = query.PARTTYPE;

        if (!partType) {
            setResponseStatus(event, 400);
            return { error: 'PARTTYPE is required' };
        }

        switch (method.toUpperCase()) {
            case 'GET':
                const categories = await getSubCategoryList(partType);
                return { body: categories, message: '' };
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