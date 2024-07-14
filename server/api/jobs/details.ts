import { getAllJobDetail } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const {  sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const categories = await getAllJobDetail( sortBy, sortOrder, filterParams)
        return { body: categories, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});