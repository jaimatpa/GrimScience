
import { eventHandler, getQuery, createError } from 'h3';
import { getRevisions,getTotalRequiredByModel } from '~/server/controller/materials';


export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { modelId} = getQuery(event);
        console.log("model is in there ",modelId);

        if (!modelId) {
            event.node.res.statusCode = 400;
            return { error: 'instanceId is required' };
        }
        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getTotalRequiredByModel (modelId as string);
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

