import { getJobParts } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { category, subCategory } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        const distinctPart = await getJobParts( category, subCategory)
        return { body: distinctPart, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});