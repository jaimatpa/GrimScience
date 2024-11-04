import { eventHandler, setResponseStatus, getQuery } from "h3";
import {
  getOrderDetailById,
  orderExistByID,
} from "~/server/controller/quotes/quotes";

export default eventHandler(async (event) => {
  try {
    const method = event.method;
    
    const query = getQuery(event);
    const orderId = query.orderId;

    if (!orderId) {
      setResponseStatus(event, 400);
      return { error: "OrderId is required" };
    }
    
    const idExist = await orderExistByID(orderId);

    switch (method.toUpperCase()) {
      case "GET":
        if (idExist) {
          const detail = await getOrderDetailById(orderId);
          return { body: detail, message: "Success!" };
        } else {
          setResponseStatus(event, 404);
          return { error: "The quotes does not exist!" };
        }

      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: `Error fetching data from table: ${error.message}` };
  }
});
