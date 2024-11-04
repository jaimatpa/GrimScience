import { getCustomerId } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus, getQuery } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event.method;  // Changed from event._method to event.method
    const query = getQuery(event);
    const orderId = query.orderId;

    if (!orderId) {
      setResponseStatus(event, 400);
      return { error: "orderId is required" };
    }

    switch (method.toUpperCase()) {
      case "GET":
        const customerId = await getCustomerId(orderId);
        return { body: customerId, message: "Success" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error("Error in CustomerId API:", error);
    setResponseStatus(event, 500);
    return { error: `Error fetching customer ID: ${error.message}` };
  }
});