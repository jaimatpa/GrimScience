import { getSignature } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    if (method === 'GET') {
      const list = await getSignature(); 
      // Return the response in a standardized format
      return { body: list, message: 'Success' }; 
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching data from table:', error);
    setResponseStatus(event, 500); // Set response status to 500 for server errors
    return { error: `Error fetching data from table: ${error.message}` };
  }
});
