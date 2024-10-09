import { eventHandler } from 'h3';
import { fetchWorkCenters } from "~/server/controller/materials";

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;

        switch (method.toUpperCase()) {
            case 'GET':
                const result = await fetchWorkCenters();
                return result
            default:
                event.node.res.statusCode = 405;
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: ` ${error.message}`
        });
    }
});