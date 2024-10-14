import { eventHandler, readBody, createError } from 'h3';
import { deletePODetailByStockNumber, savePODetailByUniqueId } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;

        if (method !== 'DELETE') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }

        const { STOCKNUMBER } = getQuery(event);

        // Pass the data to the controller function
        const result = await deletePODetailByStockNumber(STOCKNUMBER);

        return { body: result, message: 'PO detail saved successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error saving PO detail: ${error.message}`,
        });
    }
});
