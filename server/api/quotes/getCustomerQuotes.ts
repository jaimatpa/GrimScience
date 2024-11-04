import { getQuotesByCustomer } from '~/server/controller/quotes/quotes';

export default eventHandler(async (event) => {
    try {
        const { CustomerID } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const customerServiceOrders = await getQuotesByCustomer(CustomerID);
                return { body: customerServiceOrders, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});