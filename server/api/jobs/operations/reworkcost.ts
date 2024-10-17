import { reworkCostCalculate } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, operationId, reworkHrs } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        const reworkCost = await reworkCostCalculate( jobId, operationId, reworkHrs )
        return { body: reworkCost, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});