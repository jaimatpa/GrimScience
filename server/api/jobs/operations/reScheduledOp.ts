import { reScheduledOp } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { operationId, date } = getQuery(event);
    switch(method.toUpperCase()){
      case 'PUT':
        await reScheduledOp( operationId, date.slice(1, -1))
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});