import { getSourceDescriptions } from '~/server/controller/salesreport';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { source } = getQuery(event)
    switch(method.toUpperCase()){
      case 'GET':
        const sourceDescriptions = await getSourceDescriptions(source)
        return { body: sourceDescriptions, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});