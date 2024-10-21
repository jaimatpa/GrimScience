import { reOpenOperation } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const { jobId, operationId, unitCost, employee, quantity } = getQuery(event);

    const method = event._method;
    switch(method.toUpperCase()){
      case 'PUT':
        await reOpenOperation(jobId, operationId, unitCost, employee, quantity)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
