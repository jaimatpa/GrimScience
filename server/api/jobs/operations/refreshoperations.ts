import { refreshJobOperations } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, instanceId, model } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        await refreshJobOperations(jobId, instanceId, model)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});