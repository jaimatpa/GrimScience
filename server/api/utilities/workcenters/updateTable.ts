import { updateDataWorkCenters } from '~/server/controller/utilities/workcenter';
import { setResponseStatus } from 'h3';

export default eventHandler(async (event) => {
  try {
    const data = await readBody(event);
    
    if (!data.uniqueID) {
      setResponseStatus(event, 400);
      return { error: 'uniqueID is required for update' };
    }

    const response = await updateDataWorkCenters(data);
    return { 
      body: response, 
      message: 'Work center updated successfully', 
      status:200
    };
  } catch (error) {
    console.error('Error in API handler:', error);
    
    if (error.message.includes('not found')) {
      setResponseStatus(event, 404);
      return { error: error.message };
    }
    
    setResponseStatus(event, 500);
    return { error: `Error processing request: ${error.message}` };
  }
});