import { eventHandler, readBody, createError } from 'h3';
import { updatePOEntry } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;

        if (method !== 'PUT') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }
        const { UniqueID, ...data } = await readBody(event);

        const result = await updatePOEntry(UniqueID, data);

        return { body: result, message: 'PO detail saved successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error saving PO detail: ${error.message}`,
        });
    }
});
