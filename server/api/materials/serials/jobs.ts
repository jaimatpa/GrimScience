import { getJobs } from "~/server/controller/materials/serials";

export default eventHandler(async (event) => {
    try {
        // const filterParams = getQuery(event);
        const method = event._method;
        switch (method.toUpperCase()) {
            case "GET":
                console.log("Get jobs API Called");
                const list = await getJobs();
                return { body: list, message: "" };
            default:
                setResponseStatus(event, 405);
                return { error: "Method Not Allowed" };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
