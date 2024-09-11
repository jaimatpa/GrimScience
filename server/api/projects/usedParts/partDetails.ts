import { getDistinctPartTypes, getPartDetails } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const partsDetails = await getPartDetails(filterParams.JobID,filterParams.OperationID)
        return { body: partsDetails, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});