import { insertDataWorkCenters } from '~/server/controller/utilities/workcenter';
import { setResponseStatus } from 'h3';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    if (method === 'POST') {
      const data = await readBody(event); 
      const response = await insertDataWorkCenters(data);
      return { body: response, message: 'Data processed successfully' }; 
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw new Error(`Error processing request: ${error.message}`);
  }
});