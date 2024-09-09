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
        console.log({ body })
        const { ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT, POUID, PTNUM } = body;


        if (!ORDERED || !DESCRIPTION || !UNITPRICE || !UNIT || !AMOUNT) {
            event.node.res.statusCode = 400;
            return { error: 'All fields are required' };
        }
        const data = {
            ORDERED,
            RECEIVED,
            DESCRIPTION,
            STOCKNUMBER,
            PARTNUMBER,
            UNITPRICE,
            UNIT,
            AMOUNT,
            POUID,
            PTNUM,
            vendor: body?.vendor,
            Shipto: body?.shipto,
            VENDORDATE: body?.VENDORDATE,
            OPENCLOSED: body?.OPENCLOSED,
            SALESORDER: body?.SALESORDER,
            Notes: body.Notes
        };
        console.log("data for creation", JSON.stringify(data))
        const result = await savePODetailByUniqueId(data);

        return { body: result, message: 'PO detail saved successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error saving PO detail: ${error.message}`,
        });
    }
});
