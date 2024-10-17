import { saveReworkParts } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'POST':
        const { jobId, jobOperationId, parts } = await readBody(event)
        const { message } = await saveReworkParts( jobId, jobOperationId, parts )
        return { body:'', message}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});