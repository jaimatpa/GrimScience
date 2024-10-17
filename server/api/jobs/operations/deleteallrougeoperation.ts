import { deleteAllRogueOperations } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId } = getQuery(event);
    switch(method.toUpperCase()){
      case 'DELETE':
        const { message } = await deleteAllRogueOperations(jobId)
        return { body: '', message }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});