import { getPermissions } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { params } = await readBody(event);

    switch (method.toUpperCase()) {
      case "GET":
        const permissions = await getPermissions(params.system, params.subsystem);
        return { body: permissions, message: "Success" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
