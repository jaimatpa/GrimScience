import { eventHandler, readBody, createError } from 'h3';
import { createVendor } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        if (method.toUpperCase() !== 'POST') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }

        // Parse the request body
        const vendorData = await readBody(event);

        if (!vendorData) {
            event.node.res.statusCode = 400;
            return { error: 'Vendor data is required' };
        }

        // Call the controller function to create a new vendor
        const newVendor = await createVendor(vendorData);

        return { body: newVendor, message: 'Vendor created successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error creating vendor: ${error.message}`,
        });
    }
});
