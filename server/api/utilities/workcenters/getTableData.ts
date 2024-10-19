import { getAllWorkCenterData } from '~/server/controller/utilities/workcenter';
import { setResponseStatus } from 'h3';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;
    
    if (method === 'GET') {
      const list = await getAllWorkCenterData();
      console.log("api call receive data ",list)
      return {body:list, message: '' }; 
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});