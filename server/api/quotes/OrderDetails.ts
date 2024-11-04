import { getOrderDetails } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus, getQuery } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;
    if (method !== 'GET') {
      setResponseStatus(event, 405);
      return { error: "Method Not Allowed" };
    }

    const params = getQuery(event);
    const orderDetails = await getOrderDetails(params);
    return { body: orderDetails, message: "Success" };
  } catch (error) {
    console.error("Error in OrderDetails API:", error);
    setResponseStatus(event, 500);
    return { error: `Error fetching order details: ${error.message}` };
  }
});