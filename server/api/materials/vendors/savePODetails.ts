import { eventHandler, readBody, createError } from 'h3';
import { savePODetailByUniqueId } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event.node.req.method;

        if (method !== 'POST') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }

        const body = await readBody(event);

        // Destructure the necessary fields from the body
        const { ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT, POUID, PTNUM } = body;


        if (!ORDERED || !DESCRIPTION || !UNITPRICE || !UNIT || !AMOUNT) {
            event.node.res.statusCode = 400;
            return { error: 'All fields are required' };
        }

        // Pass the data to the controller function
        const result = await savePODetailByUniqueId({
            ORDERED,
            RECEIVED,
            DESCRIPTION,
            STOCKNUMBER,
            PARTNUMBER,
            UNITPRICE,
            UNIT,
            AMOUNT,
            POUID,
            PTNUM
        });

        return { body: result, message: 'PO detail saved successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error saving PO detail: ${error.message}`,
        });
    }
});
