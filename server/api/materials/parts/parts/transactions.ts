import { getInventoryTransactionsByModel } from "~/server/controller/materials";

export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { model } = getQuery(event);
        console.log("another model is",model);

        if (!model) {
            event.node.res.statusCode = 400;
            return { error: 'Model is required' };
        }
        switch (method.toUpperCase()) {
            case 'GET':
                const result = await getInventoryTransactionsByModel(model as string);
                return { body: result, message: '' };
            default:
                event.node.res.statusCode = 405;
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error fetching inventory transactions: ${error.message}`,
        });
    }
});
