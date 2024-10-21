import { updateJobSerial } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  jobId, jobQty, begSerial } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'PUT':
        const newSerials = await updateJobSerial( jobId, jobQty, begSerial)
        return { body: newSerials, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});