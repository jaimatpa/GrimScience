import { createSerial, getSerials, updateSerial } from "~/server/controller/materials/serials";

export default eventHandler(async (event) => {
    try {
        const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case "GET":
                console.log("Get serials API Called", filterParams);
                const list = await getSerials(page, pageSize, filterParams);

                return { body: list, message: "" };
            case "POST":
                console.log("create serial API called");
                const data = await readBody(event);
                console.log(data);
                const newSerial = await createSerial(data);
                return { body: { newSerial }, message: "New serial created successfully!" };
            case "PUT":
                const params = getQuery(event);
                const updatedSerial = await updateSerial(params);
                return { body: { updatedSerial }, message: "Serial updated successfully!" };
            default:
                setResponseStatus(event, 405);
                return { error: "Method Not Allowed" };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
