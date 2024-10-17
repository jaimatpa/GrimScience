import { removePart } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, jobOperationId, partId } = getQuery(event);
    console.log( jobId, jobOperationId, partId)
    switch(method.toUpperCase()){
      case 'DELETE':
        const list = await removePart( jobId, jobOperationId, partId )
        return { body: list, message: ''}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});