import { eventHandler, setResponseStatus, getQuery } from "h3";

import { getTblOrderDetails } from "~/server/controller/quotes/quotes";

export default eventHandler(async (event) => {
  try {
    const method = event.method;

    const query = getQuery(event);

    const orderId = parseInt(query.orderId);

    const results = await getTblOrderDetails(orderId);

    return {
      statusCode: 200,
      body: results,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        message: error.message,
      },
    };
  }
});
