import { eventHandler, getQuery } from 'h3';
import { getVendorSuppliedParts } from "~/server/controller/materials";

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;
        const { search } = getQuery(event);

        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getVendorSuppliedParts(
                    search as string
                );
                return { body: result[0], message: '' };
            default:
                event.node.res.statusCode = 405;
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error fetching vendor supplied parts: ${error.message}`
        });
    }
});