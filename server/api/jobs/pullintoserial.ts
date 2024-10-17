import { pullIntoSerial } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  serialList, instanceId, employee, perType, jobPart, jobId, model, date } = getQuery(event);

    const method = event._method;
    switch(method.toUpperCase()){
      case 'PUT':
        const {serialItems, message} = await pullIntoSerial(serialList, instanceId, employee, perType, jobPart, jobId, model, date.slice(1, -1))
        return { body: serialItems, message }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
