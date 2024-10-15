import { refreshJobCosts } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobId, latestUnitCost } = getQuery(event);
    console.log(jobId, latestUnitCost )
    switch(method.toUpperCase()){
      case 'GET':
        const jobCost = await refreshJobCosts( jobId, latestUnitCost)
        return { body: jobCost, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});