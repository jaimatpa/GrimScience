import { getOperationHoursWorked } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    // Extract query parameters with fallback
    const params = getQuery(event);
    console.log("query is",params);
    const operationId = params.operationId;
    const jobid = params.jobid;
  
    // Log the extracted values
    console.log('Operation ID:', operationId);
    console.log('Job ID:', jobid);
  
    // Example function call (you need to implement this)
    const idExist = await getOperationHoursWorked(operationId, jobid);
    console.log("All inventory", idExist);
  
    // Handling different HTTP methods
    switch (event._method.toUpperCase()) {
      case 'GET':
        if (idExist) {
          console.log('successful', idExist);
          return { body: idExist, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The project does not exist' };
        }
      break;
  
      default:
        setResponseStatus(event, 405); // Method Not Allowed
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    setResponseStatus(event, 500); // Internal Server Error
    return { error: 'Internal Server Error' };
  }
});
