import { updateChangeOrderData } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    if (method === 'POST') {
      const body = await readBody(event);
      const result = await updateChangeOrderData(body);
      return { body: result };
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw new Error(`Error processing request: ${error.message}`);
  }
});