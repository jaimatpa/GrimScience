import { deleteOrder } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { orderId } = await readBody(event);

    switch (method.toUpperCase()) {
      case "DELETE":
        await deleteOrder(orderId);
        return { message: "Order deleted successfully" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
});