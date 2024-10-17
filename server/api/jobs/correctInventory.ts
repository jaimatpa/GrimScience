import { correctInventory } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, employee, jobDetailId } = getQuery(event);
    switch(method.toUpperCase()){
      case 'PUT':
        await correctInventory( jobId, employee, jobDetailId )
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});