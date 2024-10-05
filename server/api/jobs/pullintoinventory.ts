import { pullIntoInventory } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  subSerialList, instanceId, employee, perType, jobPart, jobId, qty, jobQty, latestUnitCost, date } = await readBody(event);

    const method = event._method;
    switch(method.toUpperCase()){
      case 'PUT':
        const { LatestUnitCost, message } = await pullIntoInventory(subSerialList, instanceId, employee, perType, qty, jobQty, latestUnitCost, jobId, jobPart, date.slice(1, -1))
        return { body: LatestUnitCost, message }
      default: 
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
