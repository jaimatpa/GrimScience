import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { updateChangeOrderData } from '~/server/controller/engineering';

export default defineEventHandler(async (event) => {
  try {
    const method = event.node.req.method; 

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
    setResponseStatus(event, 500); 
    return { error: `Error processing request: ${error.message}` };
  }
});