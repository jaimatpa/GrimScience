import { getProductLine } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { orderId } = await readBody(event);

    switch (method.toUpperCase()) {
      case "GET":
        const productLine = await getProductLine(orderId);
        return { body: productLine, message: "Success" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching product line: ${error.message}`);
  }
});