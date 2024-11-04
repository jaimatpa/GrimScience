import { eventHandler, setResponseStatus, getQuery } from "h3";
import { addOrderDetail } from "~/server/controller/quotes/quotes";


export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await addOrderDetail(body);
    return {
      statusCode: 200,
      body: result,
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
