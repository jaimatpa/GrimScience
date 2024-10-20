import { eventHandler, getQuery, createError } from "h3";
import { getPODetailsByInstanceId } from "~/server/controller/materials/Parts";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { instanceId } = getQuery(event);
    if (!instanceId) {
      event.node.res.statusCode = 400;
      return { error: "instanceId is required" };
    }
    switch (method.toUpperCase()) {
      case "GET":
        const result = await getPODetailsByInstanceId(instanceId as string);
        return { body: result, message: "" };
      default:
        event.node.res.statusCode = 405;
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching inventory transactions: ${error.message}`,
    });
  }
});
