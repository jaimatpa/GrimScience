import { getSelectedPartInfo } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, jobOperationId } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getSelectedPartInfo(jobId, jobOperationId)
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});