import { eventHandler, getQuery, createError } from 'h3';
import { getPoByVendor } from '~/server/controller/materials';


export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { vendor} = getQuery(event);

        if (!vendor) {
            event.node.res.statusCode = 400;
            return { error: 'vendor is required' };
        }
        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getPoByVendor(vendor as string);
                return { body: result, message: '' };
            default:
                event.node.res.statusCode = 405;
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error fetching inventory transactions: ${error.message}`,
        });
    }
});
