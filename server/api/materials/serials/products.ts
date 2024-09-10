import { getProductsByProductLine } from "~/server/controller/materials/serials";

export default eventHandler(async (event) => {
    try {
        const filterParams = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case "GET":
                console.log("Get product infos API Called", filterParams);
                const list = await getProductsByProductLine(filterParams);
                return { body: list, message: "" };
            default:
                setResponseStatus(event, 405);
                return { error: "Method Not Allowed" };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
