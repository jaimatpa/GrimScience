import { getModels } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { productline } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        const categories = await getModels(productline)
        return { body: categories, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});