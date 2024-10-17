
import { eventHandler, getQuery, createError } from 'h3';
import { getTotalRequiredByModel } from '~/server/controller/materials';


export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { model} = getQuery(event);
        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getTotalRequiredByModel(model as string);
                return { body: result, message: 'Success' };
            default:
                event.node.res.statusCode = 405;
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error fetching data: ${error.message}`,
        });
    }
});
