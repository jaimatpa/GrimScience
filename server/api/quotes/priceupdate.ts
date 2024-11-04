
import { eventHandler } from 'h3';
import { updateOrderPrice } from '~/server/controller/quotes/quotes';

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body.orderDetailId || body.newPrice === undefined) {
      return {
        statusCode: 400,
        body: {
          message: "Missing required fields"
        }
      };
    }

    const result = await updateOrderPrice(body.orderDetailId, body.newPrice);

    return {
      statusCode: 200,
      body: {
        message: "Price updated successfully",
        result
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        message: error.message
      }
    };
  }
});