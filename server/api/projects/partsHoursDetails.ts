import { gePartsHours } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const jobId = getQuery(event).JobId; 
    const OperationID = getQuery(event).OperationID; 
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const parts = await gePartsHours(jobId, OperationID);
        return { body: parts, message: '' };
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error(`Error fetching data from table: ${error.message}`);
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
});



