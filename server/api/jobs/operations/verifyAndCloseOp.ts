import { verifyAndCloseOperation } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const { jobId, operationId, reworkHours, employee, perType, quantity } = getQuery(event);
    console.log(jobId, operationId, reworkHours, employee, perType, quantity)
    const method = event._method;
    switch(method.toUpperCase()){
      case 'PUT':
        await verifyAndCloseOperation(jobId, operationId, reworkHours, employee, perType, quantity)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
