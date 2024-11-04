import { getOperationHoursWorked } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const params = getQuery(event);
    const operationId = params.operationId;
    const jobid = params.jobid;
  
    const idExist = await getOperationHoursWorked(operationId, jobid);
    switch (event._method.toUpperCase()) {
      case 'GET':
        if (idExist) {
          return { body: idExist, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The project does not exist' };
        }
      break;
  
      default:
        setResponseStatus(event, 405); 
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    setResponseStatus(event, 500); 
    return { error: 'Internal Server Error' };
  }
});
