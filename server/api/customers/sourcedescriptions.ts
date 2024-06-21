import { getSourceDescriptiosBySource } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { source } = getQuery(event)
    switch(method.toUpperCase()){
      case 'GET':
        const sources = await getSourceDescriptiosBySource(source as string)
        return { body: sources, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});