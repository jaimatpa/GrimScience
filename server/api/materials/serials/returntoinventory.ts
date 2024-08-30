import { returnToInventory } from "~/server/controller/materials/serials";

export default eventHandler(async (event) => {
    try {
        const params = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case "POST":
                const result = await returnToInventory(params);
                return { body: result, message: "Returned to Inventory" };
            default:
                setResponseStatus(event, 405);
                return { error: "Method Not Allowed" };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
