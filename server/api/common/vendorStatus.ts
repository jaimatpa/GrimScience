import { getVendorStatus } from "~/server/controller/common/Vendor";

export default eventHandler(async (event) => {
    try {
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const status = await getVendorStatus()
                return { body: status, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});