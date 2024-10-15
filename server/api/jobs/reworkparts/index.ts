import { getReworkParts } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const { ...filterParams } = getQuery(event);
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getReworkParts(filterParams);
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});
