import { processSerials } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  serialList, instanceId, employee, perType, jobPart } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'PUT':
        const newSerials = await processSerials(serialList, instanceId, employee, perType, jobPart)
        return { body: newSerials, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});