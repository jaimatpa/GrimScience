import { eventHandler, readBody, createError } from 'h3';
import { updateVendor } from '~/server/controller/materials';

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        if (method.toUpperCase() !== 'PUT') {
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
        }

        // Parse the request body
        const vendorData = await readBody(event);

        if (!vendorData || !vendorData.UniqueID) {
            event.node.res.statusCode = 400;
            return { error: 'Vendor data and UniqueID are required' };
        }

        // Call the controller function to update the vendor
        const updatedVendor = await updateVendor(vendorData);

        return { body: updatedVendor, message: 'Vendor updated successfully' };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error updating vendor: ${error.message}`,
        });
    }
});
