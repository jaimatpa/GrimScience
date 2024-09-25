import { fixSerialIssue } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  serialList, instanceId, employee, perType, jobPart, jobId, date } = getQuery(event);

    const method = event._method;
    console.log(date)
    switch(method.toUpperCase()){
      case 'PUT':
        const {serialItems, message} = await fixSerialIssue(serialList, instanceId, employee, perType, jobPart, jobId, date.slice(1, -1))
        return { body: serialItems, message }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
