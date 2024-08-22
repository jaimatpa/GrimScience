import { getVendorDetails } from "~/server/controller/materials";

export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { id } = getQuery(event);


        switch (method.toUpperCase()) {
            case 'GET':
                const vendorList = await getVendorDetails(id)
                return { body: vendorList, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});