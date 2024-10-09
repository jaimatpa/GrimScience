import { eventHandler, readBody, createError } from 'h3';
import { createNewPOEntry } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;

        if (method !== 'POST') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }
        const body = await readBody(event);

        const result = await createNewPOEntry(body);

        return { body: result, message: 'PO detail saved successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error saving PO detail: ${error.message}`,
        });
    }
});
