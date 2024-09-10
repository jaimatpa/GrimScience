
import { eventHandler, getQuery, createError } from 'h3';
import { getRevisions } from '~/server/controller/materials';


export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { instanceId} = getQuery(event);
        console.log("instance is in there ",instanceId);

        if (!instanceId) {
            event.node.res.statusCode = 400;
            return { error: 'instanceId is required' };
        }
        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getRevisions(instanceId as string);
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
